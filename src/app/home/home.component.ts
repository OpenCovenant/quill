import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    BehaviorSubject,
    debounceTime,
    filter,
    finalize,
    fromEvent,
    tap
} from 'rxjs';

import { CursorPosition } from '../models/cursor-position';
import { CursorPlacement } from '../models/cursor-placement';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ProcessedText } from '../models/processed-text';
import { TextMarking } from '../models/text-marking';
import { environment } from '../../environments/environment';
import {
    markText,
    shouldNotMarkEditor,
    sortParagraphedTextMarkings
} from '../text-marking/text-marking';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    SECONDS: number = 1000;
    EVENTUAL_MARKING_TIME: number = 1.5 * this.SECONDS;
    EVENTUAL_WRITTEN_TEXT_STORAGE_TIME: number = 15 * this.SECONDS;
    EVENTUAL_SUGGESTION_SELECTION_POST: number = 6 * this.SECONDS;
    EMPTY_STRING: string = '';
    EDITOR_KEY: string = 'editor';
    PLACEHOLDER_ELEMENT_ID: string = 'editor-placeholder';
    MAX_EDITOR_CHARACTERS: number = 5000;
    MAX_EDITOR_CHARACTERS_MESSAGE =
        `Keni arritur kufirin e ${this.MAX_EDITOR_CHARACTERS / 1000} mijë karaktereve, shkurtoni shkrimin`;
    LINE_BREAK: string = '<br>';
    LINE_BROKEN_PARAGRAPH: string = '<p>' + this.LINE_BREAK + '</p>';
    processedText: ProcessedText | undefined;
    tempProcessedText: ProcessedText | undefined;
    characterCount: number = 0;
    wordCount: number = 0;
    innerHTMLOfEditor: string = this.LINE_BROKEN_PARAGRAPH;
    shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
    loading$ = new BehaviorSubject<boolean>(false);
    editorElement!: HTMLElement;
    highlightedMarkingIndex: number = -1;
    cardsToRemove: number[] = [];
    cardSuggestionsToRemove: {
        textMarkingIndex: number;
        suggestionIndex: number;
    }[] = [];
    deleteTimer: number | undefined;
    characterCountPrePost: number = 0;
    cardsElementToRemove: any[] = [];
    animationRemoved = new EventEmitter<void>();
    suggestedMarkingCardCounter: number = 0;
    textMarkingParagraphIndex: any[] = [];

    private placeHolderElement!: HTMLElement;
    private baseURL!: string;
    private generateMarkingsURL!: string;
    private uploadDocumentURL!: string;
    private pingURL!: string;
    private savedCursorPosition: CursorPosition | undefined;
    private eventualMarkingSubscription$: any;
    private eventualTextStoringSubscription$: any;
    private animationRemovedSubscription: any;
    private fromEditorInputEvent$: any;

    constructor(
        public localStorageService: LocalStorageService,
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();

        this.http.get(this.pingURL).subscribe({
            next: () => console.log('pinging server...'),
            error: (e: HttpErrorResponse) => this.disableEditor(e)
        });
    }

    ngAfterViewInit(): void {
        // save reference and reuse variable instead of reinitializing multiple times
        this.editorElement = document.getElementById(this.EDITOR_KEY)!;
        this.placeHolderElement = document.getElementById(
            this.PLACEHOLDER_ELEMENT_ID
        )!;
        const minWidthMatchMedia: MediaQueryList =
            window.matchMedia('(min-width: 800px)');
        this.focusOnMediaMatch(minWidthMatchMedia);
        if (minWidthMatchMedia.addEventListener) {
            minWidthMatchMedia.addEventListener(
                'change',
                this.focusOnMediaMatch
            );
        } else {
            // TODO some browsers still seem to use this deprecated method, keep it around for some more time
            minWidthMatchMedia.addListener(this.focusOnMediaMatch);
        }
        (
            document.getElementById(
                'flex-switch-check-checked'
            ) as HTMLInputElement
        ).checked = this.localStorageService.canStoreWrittenTexts;

        this.fromEditorInputEvent$ = fromEvent(
            document.getElementById(this.EDITOR_KEY)!,
            'input'
        );

        this.subscribeForWritingInTheEditor();
        this.subscribeForStoringWrittenText();
        this.subscribeForRemovedSuggestionCarAnimation();
    }

    ngOnDestroy(): void {
        this.eventualMarkingSubscription$.unsubscribe();
        this.eventualTextStoringSubscription$.unsubscribe();
        this.animationRemovedSubscription.unsubscribe();
    }

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.generateMarkingsURL =
            this.baseURL + '/api/generateMarkingsForParagraphs';
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
        this.pingURL = this.baseURL + '/api/ping';
    }

    /**
     * Function that is called when text is pasted in the editor.
     * @param {ClipboardEvent} $event the event emitted
     */
    onTextPaste($event: ClipboardEvent): void {
        $event.preventDefault();
        if (!$event.clipboardData) {
            return;
        }
        const text: string = $event.clipboardData.getData('text/plain');

        document.execCommand('insertText', false, text);
    }

    onKeyDown($event: KeyboardEvent): void {
        if (this.characterCount >= this.MAX_EDITOR_CHARACTERS) {
            if ($event.key !== 'Backspace') {
                $event.preventDefault();
            }
        }
    }

    /**
     * Updates the character count field to the number of characters shown in the editor
     */
    updateCharacterCount(): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (editor.innerHTML === this.LINE_BROKEN_PARAGRAPH) {
            this.characterCount = 0;
            return;
        }
        this.characterCount = editor.innerText.replace(
            /\n/g,
            this.EMPTY_STRING
        ).length;
    }

    /**
     * Updates the word count field to the number of words shown in the editor
     */
    updateWordCount(): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (editor.innerText === this.EMPTY_STRING) {
            this.wordCount = 0;
        } else {
            const wordMatches = editor.innerText.match(/\b([\w'-]+)\b/g)!;
            if (wordMatches) {
                this.wordCount = wordMatches.length;
            } else {
                this.wordCount = 0;
            }
        }
    }

    /**
     * Uploads the selected document to be marked
     * @param {Event} $event the event emitted when the file is selected
     */
    uploadDocument($event: Event): void {
        const fileList: FileList | null = ($event.target as HTMLInputElement)
            .files;
        if (fileList && fileList.length === 1) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.http
                .post(this.uploadDocumentURL, formData)
                .subscribe((next) => {
                    this.processedText = next as ProcessedText;
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.textMarkings.length
                    ).fill(true);

                    document.getElementById(this.EDITOR_KEY)!.innerHTML =
                        this.processedText.text; // TODO: improve to add newlines and such
                    // this.innerHTMLOfEditor = this.LINE_BROKEN_PARAGRAPH; // TODO careful with the <br> here
                    this.markEditor(CursorPlacement.END);
                });
        } else {
            alert('Ngarko vetëm një dokument!');
        }
    }

    /**
     * Apply the chosen suggestion in the editor.
     * @param {number} textMarkingIndex the index of the chosen TextMarking
     * @param {number} suggestionIndex the index of the chosen Suggestion of the above TextMarking
     */
    chooseSuggestion(textMarkingIndex: number, suggestionIndex: number): void {
        if (this.cardsToRemove.length >= 1) return; // prevents collision action between suggestion and deletion
        this.suggestedMarkingCardCounter++;
        this.cardSuggestionsToRemove.push({
            textMarkingIndex,
            suggestionIndex
        });

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (this.highlightedMarkingIndex >= 0) {
            this.processTextMarkingSelected(editor);
            return;
        }

        this.slideFadeAnimationCard(textMarkingIndex);

        if (document.querySelectorAll('#editor > p > span').length === 1) {
            setTimeout(() => {
                this.processTextMarkingSelected(editor);
            }, 900);
            return;
        }

        clearTimeout(this.deleteTimer);
        this.deleteTimer = setTimeout(() => {
            const cards = document.querySelectorAll(
                '.sticky .card'
            ) as NodeListOf<HTMLElement>;

            this.cardSuggestionsToRemove.forEach((removeItem) => {
                document
                    .getElementsByClassName('sticky')[0]
                    .classList.add('screen-height-delay');

                cards
                    .item(removeItem.textMarkingIndex)
                    .classList.add('card-hidden');

                cards.forEach((card, index) => {
                    this.handleSuggestionCardAnimation(
                        this.cardSuggestionsToRemove.length,
                        card,
                        index,
                        removeItem.textMarkingIndex,
                        cards.length - 1
                    );
                });
            });

            this.removeScreenHeightDelay();

            // don't choose suggestions on an uploaded file
            this.cardSuggestionsToRemove.forEach((removeItem) => {
                this.replaceSuggestedNode(editor, removeItem);
            });

            this.cardSuggestionsToRemove = [];
        }, 1500);
    }

    /**
     * Selected marking is processed and replaced by the selected suggestion option.
     *
     * @param {any} editor - The editor element to be updated.
     * */
    processTextMarkingSelected(editor: any): void {
        this.cardSuggestionsToRemove.forEach((removeItem) => {
            this.replaceSuggestedNode(editor, removeItem);
        });

        this.postSuggestedText(editor);
    }

    /**
     * Handle animations for card suggestion in the editor.
     *
     * The animations are based on the number of cards to remove and their respective indexes.
     * It adds specific classes for single and multiple card removal animations and listens
     * for the animationend event to remove the animation classes after completion.
     *
     * @param {number} cardsToRemove - The total number of cards to be removed.
     * @param {HTMLElement} card - The card element to apply animations.
     * @param {number} index - The index of the card in the editor.
     * @param {number} removeItem - The index of the card to be removed.
     * @param {number} lastIndex - The index of the last card.
     */
    handleSuggestionCardAnimation(
        cardsToRemove: number,
        card: HTMLElement,
        index: number,
        removeItem: number,
        lastIndex: number
    ): void {
        if (lastIndex === 0) {
            setTimeout(() => {
                this.triggerSuggestionEmitterAnimation(lastIndex === index);
            }, 100);
            return;
        }

        if (index >= removeItem) {
            if (cardsToRemove === 1) {
                card.classList.add('move-up-animation');
                card.addEventListener('animationend', () => {
                    card.classList.remove('move-up-animation');
                    this.triggerSuggestionEmitterAnimation(lastIndex === index);
                });
            } else if (cardsToRemove >= 2) {
                card.classList.add('move-up-multiple-animation');
                card.addEventListener('animationend', () => {
                    card.classList.remove('move-up-multiple-animation');
                    this.triggerSuggestionEmitterAnimation(lastIndex === index);
                });
            }
        }
    }

    /**
     * Evaluates readiness of cards and initiates a post request when ready.
     *
     * This method inspects the cards and determines if they're ready for further processing.
     */
    checkForAnimationRemoval(): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        const cards = document.querySelectorAll(
            '.sticky .card'
        ) as NodeListOf<HTMLElement>;

        if (
            this.checkMoveUpAnimationState(cards) ||
            this.suggestedMarkingCardCounter === cards.length
        ) {
            this.postSuggestedText(editor);
        }
    }

    /**
     * Check the animation state of cards within an HTML document.
     * The presence of these classes indicates that the corresponding card is still undergoing animation.
     *
     * @param {NodeListOf<HTMLElement>} cards - A NodeList containing the HTML elements representing the cards to be checked.
     * @returns {boolean} - Returns `true` if any card in the provided list still contains the animation classes; otherwise, returns `false`.
     */
    checkMoveUpAnimationState(cards: NodeListOf<HTMLElement>): boolean {
        return Array.from(cards).some(
            (card) =>
                card.classList.contains('move-up-animation') ||
                card.classList.contains('move-up-multiple-animation')
        );
    }

    /**
     * Post the suggested text to the server for processing and update the editor accordingly.
     *
     * This method sends the content of the editor to the server, receives processed text with markings,
     * and updates the editor's content, applying text markings and adjusting cursor position.
     *
     * @param {any} editor - The editor element to be updated.
     * */
    postSuggestedText(editor: any): void {
        this.http
            .post(this.generateMarkingsURL, editor.innerHTML)
            .subscribe((next) => {
                this.processedText = next as ProcessedText;

                this.processedText.textMarkings =
                    this.filterUnselectedMarkingTypes(
                        this.processedText.textMarkings
                    );

                if (this.processedText?.textMarkings.length != 0) {
                    this.processedText.textMarkings =
                        sortParagraphedTextMarkings(
                            this.processedText.textMarkings
                        );

                    this.tempProcessedText = this.tempProcessedText =
                        JSON.parse(JSON.stringify(this.processedText));
                    this.textMarkingParagraphIndex = [];
                    this.separateParagraphIndex(this.tempProcessedText);

                    const consumableTextMarkings: TextMarking[] = Array.from(
                        this.processedText.textMarkings
                    );

                    editor.childNodes.forEach(
                        (childNode: ChildNode, index: number) => {
                            const isLastChildNode =
                                index === editor.childNodes.length - 1;
                            const p = document.createElement('p');
                            p.innerHTML = childNode.textContent!;
                            if (childNode.textContent === this.EMPTY_STRING) {
                                p.innerHTML = this.LINE_BREAK;
                            }
                            editor.replaceChild(p, childNode);
                            markText(
                                p,
                                consumableTextMarkings.length,
                                isLastChildNode,
                                consumableTextMarkings.filter(
                                    (tm: TextMarking) => tm.paragraph === index
                                )
                            );
                        }
                    );

                    // TODO editor or childNode here? I guess we have to do the whole thing always...
                    // markText(editor, consumableTextMarkings.filter((tm: TextMarking) => tm.paragraph === textMarking.paragraph!));
                }

                this.positionCursorToEnd(editor);
                this.updateCharacterAndWordCount();

                this.shouldCollapseSuggestions = new Array<boolean>(
                    this.processedText.textMarkings.length
                ).fill(true);

                this.blurHighlightedBoardMarking();
                this.listenForMarkingHighlight();
                this.cardSuggestionsToRemove = [];
                this.characterCountPrePost = 0;
                this.suggestedMarkingCardCounter = 0;
            });
    }

    private separateParagraphIndex(
        tempProcessedText: ProcessedText | undefined
    ): void {
        let tempIndexValue = 0;
        tempProcessedText?.textMarkings.forEach((textMarking, index) => {
            if (tempIndexValue > textMarking.to) {
                this.textMarkingParagraphIndex.push(index);
            }
            tempIndexValue = textMarking.to;
        });
    }

    /**
     * Replace a suggested node in the editor with the chosen suggestion.
     *
     * This method takes the index of the text marking and the index of the suggestion to be applied.
     * It replaces the content of the corresponding paragraph in the editor with the chosen suggestion,
     * considering the starting and ending positions of the text marking.
     *
     * @param {any} editor - The editor element to be updated.
     * @param {{ textMarkingIndex: number, suggestionIndex: number }} removeItem -
     *     An object containing the index of the text marking and the index of the suggestion to be replaced.
     */
    replaceSuggestedNode(
        editor: any,
        removeItem: { textMarkingIndex: number; suggestionIndex: number }
    ): void {
        const textMarking: TextMarking =
            this.processedText!.textMarkings[removeItem.textMarkingIndex];
        const textMarkingIndex =
            this.tempProcessedText!.textMarkings[removeItem.textMarkingIndex];
        const childNode: ChildNode = editor.childNodes[textMarking.paragraph!];
        const p = document.createElement('p');

        const currentNode = childNode.textContent!.substring(
            textMarkingIndex.from,
            textMarkingIndex.to
        );
        const suggestedNode =
            textMarking.suggestions[removeItem.suggestionIndex].action;
        this.characterCountPrePost = currentNode.length - suggestedNode.length;
        let counterChar = 0;

        childNode.childNodes.forEach((node) => {
            // Clone the child node
            const clonedNode = node.cloneNode(true) as Element;
            counterChar += node.textContent?.length!;
            const isWithinRange = Math.abs(counterChar - textMarkingIndex.to);

            if (node.nodeName === 'SPAN') {
                clonedNode.classList.remove('animated-typo-marking');
            }

            if (
                node.textContent &&
                node.textContent.includes(currentNode) &&
                isWithinRange === 0 // if the index is within range
            ) {
                const lengthDiff = Math.abs(
                    suggestedNode.length - currentNode.length
                );
                counterChar -= lengthDiff;

                const replacedText = node.textContent.replace(
                    currentNode,
                    suggestedNode
                );

                const newText = document.createTextNode(replacedText);

                p.appendChild(newText);
            } else {
                p.appendChild(clonedNode);
            }
        });

        editor.replaceChild(p, childNode);
        this.updateCharacterCount();
        this.updateWordCount();
        this.updateTempMarkings(removeItem.textMarkingIndex);
    }

    /**
     * Updates the char index for all textMarkings
     * @param {number} textMarkingIndex selected marking index
     */
    updateTempMarkings(textMarkingIndex: number): void {
        if (this.characterCountPrePost === 0) return; // if no changes are needed
        const pIndexSelected = this.findRange(textMarkingIndex);

        this.tempProcessedText!.textMarkings.forEach((textMarking, index) => {
            if (
                index > textMarkingIndex &&
                pIndexSelected[0] <= index &&
                pIndexSelected[1] > index
            ) {
                textMarking.from -= this.characterCountPrePost;
                textMarking.to -= this.characterCountPrePost;
            }
        });
    }

    private findRange(index: number): [number, number] {
        let rangeStart: number | null = null;
        let rangeEnd: number | null = null;

        for (let i = 0; i < this.textMarkingParagraphIndex.length; i++) {
            if (this.textMarkingParagraphIndex[i] <= index) {
                if (
                    rangeStart === null ||
                    this.textMarkingParagraphIndex[i] > rangeStart
                ) {
                    rangeStart = this.textMarkingParagraphIndex[i];
                }
            }

            if (this.textMarkingParagraphIndex[i] > index) {
                if (
                    rangeEnd === null ||
                    this.textMarkingParagraphIndex[i] < rangeEnd
                ) {
                    rangeEnd = this.textMarkingParagraphIndex[i];
                }
            }
        }

        // Handle edge case for the first index and last index
        rangeEnd = rangeEnd ?? this.tempProcessedText!.textMarkings.length;
        rangeStart = rangeStart ?? 0;

        return [rangeStart, rangeEnd];
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    /**
     * Delete the **TextMarking** based on the **textMarkingIndex**.
     * @param {number} textMarkingIndex the index of the text marking from the list of the sorted text markings
     */
    deleteTextMarking(textMarkingIndex: number): void {
        // based on the assumption that all spans within the paragraphs of the editor are markings
        if (this.cardSuggestionsToRemove.length >= 1) return; // prevents collision action between suggestion and deletion

        this.cardsToRemove.push(textMarkingIndex);
        this.slideFadeAnimationCard(textMarkingIndex);

        clearTimeout(this.deleteTimer); // Will reset the time as the user deletes more markings
        this.deleteTimer = setTimeout(() => {
            this.moveUpRemainingCards();
        }, 1500);
    }

    /**
     * Move up and animate the remaining cards in the editor after deleting marked cards.
     *
     * This method is responsible for animating the remaining cards in the editor after
     * certain marked cards have been deleted.
     */
    moveUpRemainingCards(): void {
        const cardMarking = document.querySelectorAll('#editor > p > span');
        const cards = document.querySelectorAll(
            '.sticky .card'
        ) as NodeListOf<HTMLElement>;
        const elementNameMarking: any[] = [];

        this.cardsToRemove.forEach((removeItem) => {
            const card = cards.item(removeItem);
            const cardToRemove = this.extractCardInfo(card);
            elementNameMarking.push(cardToRemove!);

            document
                .getElementsByClassName('sticky')[0]
                .classList.add('screen-height-delay');
            card.classList.add('card-hidden');

            cards.forEach((card, index) => {
                this.handleCardAnimations(
                    this.cardsToRemove.length,
                    card,
                    index,
                    removeItem
                );
            });
        });

        this.removeScreenHeightDelay();

        elementNameMarking.forEach((elementMarking) => {
            cardMarking.forEach((card, index) => {
                if (card.textContent === elementMarking) {
                    this.cardsElementToRemove.push({
                        cardElement: card,
                        index
                    });
                }
            });
        });

        this.deleteMarkings();

        this.cardsToRemove = [];
        this.cardsElementToRemove = [];
    }

    /**
     * Delete marked elements from the editor content and update processed text.
     *
     * responsible for removing marked elements from the editor's content.
     * It replaces the marked elements with their respective text content and updates
     * the processed text data accordingly.
     */
    deleteMarkings(): void {
        const cardsToRemoveSet = new Set(this.cardsToRemove);
        this.cardsElementToRemove.forEach((cardElement) => {
            if (cardsToRemoveSet.has(cardElement.index)) {
                const currentTextMarking = cardElement.cardElement;
                const textNode = document.createTextNode(
                    currentTextMarking.textContent || ''
                );
                currentTextMarking.parentNode?.replaceChild(
                    textNode,
                    currentTextMarking
                );
            }
        });

        this.processedText!.textMarkings =
            this.processedText!.textMarkings.filter(
                (_, index) => !this.cardsToRemove.includes(index)
            );

        this.shouldCollapseSuggestions = new Array<boolean>(
            this.processedText!.textMarkings.length
        ).fill(true);
    }

    /**
     * Handle animations for card removal in the editor.
     *
     * Applies animations to cards that are being removed from the editor.
     * The animations are based on the number of cards to remove and their respective indexes.
     * It adds specific classes for single and multiple card removal animations and listens
     * for the animationend event to remove the animation classes after completion.
     *
     * @param {number} cardsToRemove - The total number of cards to be removed.
     * @param {HTMLElement} card - The card element to apply animations.
     * @param {number} index - The index of the card in the editor.
     * @param {number} removeItem - The index of the card to be removed.
     */
    handleCardAnimations(
        cardsToRemove: number,
        card: HTMLElement,
        index: number,
        removeItem: number
    ): void {
        if (index >= removeItem) {
            if (cardsToRemove === 1) {
                card.classList.add('move-up-animation');
                card.addEventListener('animationend', () => {
                    card.classList.remove('move-up-animation');
                });
            } else if (cardsToRemove >= 2) {
                card.classList.add('move-up-multiple-animation');
                card.addEventListener('animationend', () => {
                    card.classList.remove('move-up-multiple-animation');
                });
            }
        }
    }

    /**
     * Apply slide-fade animation to a card in the editor.
     * @param {number} textMarkingIndex - The index of the card to apply the animation.
     */
    slideFadeAnimationCard(textMarkingIndex: number): void {
        const cards = document.querySelectorAll(
            '.sticky .card'
        ) as NodeListOf<HTMLElement>;
        cards.item(textMarkingIndex).classList.add('fade-out');

        setTimeout(() => {
            cards.item(textMarkingIndex).classList.add('card-fade');
        }, 1000);
    }

    /**
     * Returns the actual name of the marking.
     * @param {HTMLElement} card - child node
     */
    extractCardInfo(card: HTMLElement): any {
        return card.childNodes[0].childNodes[0].childNodes[0].textContent?.replace(
            ' ',
            ''
        );
    }

    /**
     * Returns whether there is text in the editor or not
     */
    editorHasText(): boolean {
        return (
            document.getElementById(this.EDITOR_KEY)!.innerHTML !==
            this.LINE_BROKEN_PARAGRAPH
        );
    }

    /**
     * Clears the written text in the editor
     */
    clearEditor(): void {
        document.getElementById(this.EDITOR_KEY)!.innerHTML =
            this.LINE_BROKEN_PARAGRAPH;
        this.processedText = undefined;
        this.updateCharacterAndWordCount();
        this.shouldCollapseSuggestions = new Array<boolean>(0);
        this.blurHighlightedBoardMarking();
        this.cardsToRemove = [];
        this.cardSuggestionsToRemove = [];
        this.suggestedMarkingCardCounter = 0;
        this.textMarkingParagraphIndex = [];
        this.characterCountPrePost = 0;
    }

    /**
     * Expand or contract the suggestions of a given TextMarking based on an index.
     * @param {number} textMarkingIndex the index of the text marking from the list of the sorted text markings
     * @param {Event} $event the click event that is triggered when clicking on the expand/contract icon
     */
    oscillateSuggestion(textMarkingIndex: number, $event: Event): void {
        const oscillatingButtonClasses: DOMTokenList = (
            $event.target as HTMLHeadingElement
        ).classList;
        if (oscillatingButtonClasses.contains('bi-arrow-right-square')) {
            if (this.shouldCollapseSuggestions[textMarkingIndex]) {
                this.shouldCollapseSuggestions[textMarkingIndex] = false;
            }
        } else if (oscillatingButtonClasses.contains('bi-arrow-left-square')) {
            if (!this.shouldCollapseSuggestions[textMarkingIndex]) {
                this.shouldCollapseSuggestions[textMarkingIndex] = true;
            }
        } else {
            throw new Error(
                'The oscillating button should have one of these classes given that you could see it to click it!'
            );
        }
    }

    copyToClipboard(): void {
        const copyToClipboardButton: HTMLElement = document.getElementById(
            'copy-to-clipboard-button'
        )!;
        copyToClipboardButton.classList.replace(
            'bi-clipboard',
            'bi-clipboard2-check'
        );
        copyToClipboardButton.style.setProperty('color', 'green', 'important');

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (navigator.clipboard) {
            if (!editor.textContent) {
                this.brieflyChangeClipboardIcon(copyToClipboardButton);
                return;
            }
            navigator.clipboard.writeText(editor.textContent).then();
        } else {
            // TODO some browsers still seem to use this deprecated method, keep it around for some more time
            let range, select: Selection;
            if (document.createRange) {
                range = document.createRange();
                range.selectNodeContents(editor);
                select = window.getSelection()!;
                select.removeAllRanges();
                select.addRange(range);
                document.execCommand('copy');
                select.removeAllRanges();
            } else {
                // NOTE: this part might only be for IE
                range = (document.body as any).createTextRange();
                range.moveToElementText(editor);
                range.select();
                document.execCommand('copy');
            }
        }

        this.brieflyChangeClipboardIcon(copyToClipboardButton);
    }

    toggleStoringOfWrittenTexts(): void {
        this.localStorageService.toggleWritingPermission(
            (
                document.getElementById(
                    'flex-switch-check-checked'
                ) as HTMLInputElement
            ).checked
        );
    }

    // TODO rename, add docs
    focusOnMediaMatch(mediaMatch: any): void {
        if (mediaMatch.matches) {
            document.getElementById(this.EDITOR_KEY)?.focus();
        }
    }

    /**
     * Replaces the text of the editor with the given **writtenText** and generates its markings
     * @param {string} writtenText
     */
    placeWrittenText(writtenText: string): void {
        document.getElementById(this.EDITOR_KEY)!.innerText = writtenText;
        document.getElementById('close-written-texts-modal-button')!.click();
        this.markEditor();
        this.updateCharacterAndWordCount();
    }

    getTextOfTextMarking(textMarkingIndex: number): string {
        if (!this.processedText) {
            return this.EMPTY_STRING;
        }

        const textMarking: TextMarking =
            this.processedText.textMarkings[textMarkingIndex];
        if (!textMarking) {
            return this.EMPTY_STRING;
        }

        const virtualEditor: HTMLDivElement = document.createElement('div');
        virtualEditor.innerHTML = this.processedText.text;

        const editorTextContent: string | null =
            virtualEditor.childNodes[textMarking.paragraph!].textContent;
        if (!editorTextContent) {
            return this.EMPTY_STRING;
        }

        return editorTextContent.slice(textMarking.from, textMarking.to);
    }

    /**
     * Blurs the currently highlighted board marking.
     */
    blurHighlightedBoardMarking(): void {
        this.highlightedMarkingIndex = -1;
    }

    /**
     * Make the call to mark the editor into paragraphs.
     * @param {CursorPlacement} cursorPlacement
     * @private
     */
    private markEditor(
        cursorPlacement: CursorPlacement = CursorPlacement.LAST_SAVE
    ): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;

        this.loading$.next(true);
        this.http
            .post(this.generateMarkingsURL, editor.innerHTML)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (value) => {
                    this.processedText = value as ProcessedText;

                    this.processedText.textMarkings =
                        this.filterUnselectedMarkingTypes(
                            this.processedText.textMarkings
                        );

                    this.processedText.textMarkings =
                        sortParagraphedTextMarkings(
                            this.processedText.textMarkings
                        );

                    this.tempProcessedText = this.tempProcessedText =
                        JSON.parse(JSON.stringify(this.processedText));
                    this.textMarkingParagraphIndex = [];
                    this.separateParagraphIndex(this.tempProcessedText);

                    const consumableTextMarkings: TextMarking[] = Array.from(
                        this.processedText.textMarkings
                    );
                    if (cursorPlacement === CursorPlacement.LAST_SAVE) {
                        this.savedCursorPosition =
                            this.saveCursorPosition(editor);
                    }

                    editor.childNodes.forEach(
                        (childNode: ChildNode, index: number) => {
                            const isLastChildNode =
                                index === editor.childNodes.length - 1;
                            const p: HTMLParagraphElement =
                                document.createElement('p');
                            p.innerHTML = childNode.textContent!;
                            if (childNode.textContent === this.EMPTY_STRING) {
                                p.innerHTML = this.LINE_BREAK;
                            }
                            editor.replaceChild(p, childNode);
                            markText(
                                p,
                                consumableTextMarkings.length,
                                isLastChildNode,
                                consumableTextMarkings.filter(
                                    (tm: TextMarking) => tm.paragraph === index
                                )
                            );
                        }
                    );

                    this.suggestedMarkingCardCounter = 0;
                    this.positionCursor(editor, cursorPlacement);
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.textMarkings.length
                    ).fill(true);
                },
                complete: () => {
                    setTimeout(() => this.listenForMarkingHighlight(), 0);
                }
            });
    }

    private filterUnselectedMarkingTypes(
        textMarkings: TextMarking[]
    ): TextMarking[] {
        return textMarkings.filter((tM: TextMarking) => {
            if (tM.id) {
                const items = { ...localStorage };
                let b = true;
                Object.entries(items).forEach((e: any) => {
                    if (e[0] === tM.id) {
                        b = e[1] === 'true';
                    }
                });
                return b;
            } else {
                return true;
            }
        });
    }

    /**
     * Place the cursor in the given element based on the provided placement.
     * @param {HTMLElement} element
     * @param {CursorPlacement} cursorPlacement
     * @private
     */
    private positionCursor(
        element: HTMLElement,
        cursorPlacement: CursorPlacement
    ): void {
        if (cursorPlacement === CursorPlacement.LAST_SAVE) {
            if (this.savedCursorPosition) {
                this.restoreCursorPosition(element);
            }
        } else if (cursorPlacement === CursorPlacement.END) {
            this.positionCursorToEnd(element);
        }
    }

    /**
     * Places the cursor to the end of the given **elementNode**.
     * @param {HTMLElement} elementNode
     * @private
     */
    private positionCursorToEnd(elementNode: HTMLElement): void {
        const range: Range = document.createRange();
        const selection: Selection | null = window.getSelection();
        range.selectNodeContents(elementNode);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        elementNode.focus();
        range.detach();
        elementNode.scrollTop = elementNode.scrollHeight;
    }

    /**
     * Store the row and column position based on the **Range** of the current cursor position at the given
     * **elementNode**.
     * @param {Node} elementNode the working node in which we want to generate the cursor position
     */
    private saveCursorPosition(elementNode: Node): CursorPosition {
        const range: Range = window.getSelection()!.getRangeAt(0);

        let row = 0;
        elementNode.childNodes.forEach((n: Node, key: number) => {
            if (
                n.isSameNode(range.startContainer.parentNode) ||
                (n.nodeName === 'P' &&
                    n.firstChild!.nodeName === 'BR' &&
                    n.isSameNode(range.startContainer))
            ) {
                row = key;
            }
        });

        const col = range.startContainer.parentNode!.textContent!.length;

        // if the cursor is moved while the markings are still being processed, it will be reset back to its last
        // position, consider saving the cursor position when changed by the arrow keys and such, if that position is
        // of interest
        return {
            row: row,
            col: col
        };
    }

    /**
     * Restore the currently stored start and end position to a given **savedCursorPosition** in **elementNode**.
     * @param {Node} elementNode the working node in which we want to restore the start and end position
     */
    private restoreCursorPosition(elementNode: Node): void {
        let charIndex: number = 0;
        const range: Range = document.createRange();
        range.setStart(elementNode, 0);
        range.collapse(true);
        const nodeStack = [
            elementNode.childNodes[this.savedCursorPosition!.row]
        ];
        let node: Node | undefined,
            foundStart: boolean = false,
            stop: boolean = false;

        // TODO shift instead of pop?
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeName === 'BR') {
                // TODO extract this before this while loop?
                range.setStart(node, 0);
                range.setEnd(node, 0);

                const selection: Selection = window.getSelection()!;
                selection.removeAllRanges();
                selection.addRange(range);

                return;
            }
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharIndex: number =
                    charIndex + node.textContent!.length;
                if (
                    !foundStart &&
                    this.savedCursorPosition!.col >= charIndex &&
                    this.savedCursorPosition!.col <= nextCharIndex
                ) {
                    range.setStart(
                        node,
                        this.savedCursorPosition!.col - charIndex
                    );
                    foundStart = true;
                }
                if (
                    foundStart &&
                    this.savedCursorPosition!.col >= charIndex &&
                    this.savedCursorPosition!.col <= nextCharIndex
                ) {
                    range.setEnd(
                        node,
                        this.savedCursorPosition!.col - charIndex
                    );
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i: number = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        const selection: Selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private updateCharacterAndWordCount(): void {
        this.updateCharacterCount();
        this.updateWordCount();
    }

    /**
     * Functions that are called on a **input** event in the editor.
     */
    private subscribeForWritingInTheEditor(): void {
        this.eventualMarkingSubscription$ = this.fromEditorInputEvent$
            .pipe(
                tap(() => this.updateCharacterAndWordCount()),
                filter(
                    (keyboardEvent: KeyboardEvent) =>
                        !shouldNotMarkEditor(keyboardEvent)
                ),
                debounceTime(this.EVENTUAL_MARKING_TIME),
                filter(() => this.characterCount < this.MAX_EDITOR_CHARACTERS),
                tap(() => {
                    this.blurHighlightedBoardMarking();
                    this.markEditor();
                })
            )
            .subscribe();
    }

    private subscribeForStoringWrittenText(): void {
        this.eventualTextStoringSubscription$ = this.fromEditorInputEvent$
            .pipe(
                debounceTime(this.EVENTUAL_WRITTEN_TEXT_STORAGE_TIME),
                tap(() =>
                    this.localStorageService.storeWrittenText(
                        document.getElementById(this.EDITOR_KEY)!.innerText
                    )
                )
            )
            .subscribe();
    }

    private subscribeForRemovedSuggestionCarAnimation(): void {
        this.animationRemovedSubscription = this.animationRemoved
            .pipe(debounceTime(this.EVENTUAL_SUGGESTION_SELECTION_POST))
            .subscribe(() => {
                this.checkForAnimationRemoval();
            });
    }

    private disableEditor(errorResponse: HttpErrorResponse): void {
        const errorMessage =
            errorResponse.status === 429
                ? 'Tepër kërkesa për shenjime për momentin'
                : 'Fatkeqësisht kemi një problem me serverat. Ju kërkojmë ndjesë, ndërsa kërkojme për një zgjidhje.';
        (
            document.getElementById(this.EDITOR_KEY) as HTMLDivElement
        ).contentEditable = 'false';

        const placeholderElement = document.getElementById(
            this.PLACEHOLDER_ELEMENT_ID
        );
        if (placeholderElement) {
            placeholderElement.innerText = errorMessage;
        }
        (
            document.querySelectorAll(
                '.card-header button'
            ) as NodeListOf<HTMLButtonElement>
        ).forEach((b) => (b.disabled = true));
    }

    private listenForMarkingHighlight(): void {
        const textMarkings = document.querySelectorAll('#editor > p > .typo');
        textMarkings.forEach((element: Element, index: number) =>
            element.addEventListener(
                'click',
                this.highlightBoardMarking.bind(this, index)
            )
        );
    }

    /**
     * Clicking on an editor marking, highlights it in the board of markings.
     *
     * @param {number} textMarkingIndex
     */
    private highlightBoardMarking(textMarkingIndex: number): void {
        this.highlightedMarkingIndex = textMarkingIndex;
    }

    private brieflyChangeClipboardIcon(
        copyToClipboardButton: HTMLElement
    ): void {
        setTimeout(() => {
            copyToClipboardButton.classList.replace(
                'bi-clipboard2-check',
                'bi-clipboard'
            );
            copyToClipboardButton.style.color = 'black';
        }, 2 * this.SECONDS);
    }

    private removeScreenHeightDelay(): void {
        const sticky = document.getElementsByClassName('sticky')[0];
        setTimeout(() => {
            sticky.classList.remove('screen-height-delay');
        }, 800);
    }

    private triggerSuggestionEmitterAnimation(isLastIndex: boolean): void {
        if (this.cardSuggestionsToRemove && isLastIndex) {
            this.animationRemoved.emit();
        }
    }
}
