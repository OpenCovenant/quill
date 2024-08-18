import {
    AfterViewInit,
    Component,
    ElementRef,
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
    mergeWith,
    Subject,
    tap
} from 'rxjs';

import { CursorPosition } from '../models/cursor-position';
import { CursorPlacement } from '../models/cursor-placement';
import { WritingsHistoryService } from '../services/writings-history.service';
import { ProcessedText } from '../models/processed-text';
import { Marking } from '../models/marking';
import { environment } from '../../environments/environment';
import {
    markElement,
    shouldNotMarkEditor,
    sortMarkings
} from '../element-marking/element-marking';
import { DarkModeService } from '../services/dark-mode.service';
import { Router } from '@angular/router';
import { EditorContentService } from '../services/editor-content.service';

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
    MAX_EDITOR_CHARACTERS: number = 10000;
    MAX_EDITOR_CHARACTERS_MESSAGE: string = `Keni arritur kufirin e ${this.MAX_EDITOR_CHARACTERS} karaktereve, shkurtoni shkrimin.`;
    UNCONVENTIONAL_CHARACTERS_MESSAGE: string = `Shkrimi juaj përmban karaktere jashtë standardit. Zëvendësoni këto karaktere për të gjeneruar shenjime.`;
    UNCONVENTIONAL_CHARACTERS = ['ë']; // think there's something about "i" as well (and of course maybe for some others)
    LINE_BREAK: string = '<br>';
    LINE_BROKEN_PARAGRAPH: string = '<p>' + this.LINE_BREAK + '</p>';
    processedText: ProcessedText | undefined;

    tempProcessedText: ProcessedText | undefined;

    characterCount: number = 0;
    wordCount: number = 0;
    innerHTMLOfEditor: string = this.LINE_BROKEN_PARAGRAPH;
    shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    editorElement!: HTMLElement;
    highlightedMarkingIndex: number = -1;

    readonly ANIMATION_END_EVENT: string = 'animationend';
    indicesOfMarkingsToDismiss: number[] = [];
    suggestionsOfMarkingsToChoose: {
        markingIndex: number;
        suggestionIndex: number;
    }[] = [];
    characterCountPrePost: number = 0; // TODO: seems like a crutch
    cardCountSelectedPrePost: number = 0; // TODO: seems like a crutch
    markingCardsToDismiss: any[] = [];
    animationRemoved: EventEmitter<void> = new EventEmitter<void>(); // TODO consider replacing with the proper subject
    suggestedMarkingCardCounter: number = 0; // TODO: seems like a crutch
    markingParagraphIndex: any[] = [];

    markingDismissalSubject$: Subject<void> = new Subject<void>();
    suggestionChoosingSubject$: Subject<void> = new Subject<void>();

    shouldShowThankYouModal: boolean = false; // TODO: exists because `this.router.getCurrentNavigation()` is not null only in the constructor
    shouldShowWelcomeModal: boolean = false; // TODO: exists because `this.router.getCurrentNavigation()` is not null only in the constructor

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
        private httpClient: HttpClient,
        private router: Router,
        private editorContentService: EditorContentService,
        private elementRef: ElementRef,
        public darkModeService: DarkModeService,
        public writingsHistoryService: WritingsHistoryService
    ) {
        this.initializeURLs();
        this.addEventListenerForShortcuts();

        this.showWelcomeModal();
        this.showThankYouModal();

        this.httpClient.get(this.pingURL).subscribe({
            next: () => console.log('pinging server...'),
            error: (e: HttpErrorResponse) => this.disableEditor(e)
        });
    }

    ngAfterViewInit(): void {
        // save reference and reuse variable instead of reinitializing multiple times
        this.editorElement = document.getElementById(this.EDITOR_KEY)!;

        if (this.editorContentService.editorInnerHTML) {
            this.editorElement.innerHTML =
                this.editorContentService.editorInnerHTML;
        }

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
        ).checked = this.writingsHistoryService.canStoreWritings;

        this.fromEditorInputEvent$ = fromEvent(
            document.getElementById(this.EDITOR_KEY)!,
            'input'
        );

        this.subscribeForWritingInTheEditor();
        this.subscribeForStoringWrittenText();
        this.subscribeForRemovedSuggestionCardAnimation();

        this.markingDismissalSubject$
            .pipe(
                mergeWith(this.suggestionChoosingSubject$),
                debounceTime(1500)
            )
            .subscribe((): void => {
                this.moveUpRemainingChosenSuggestionMarkings();
                this.moveUpRemainingDismissedMarkings();
                this.markEditor();
            });

        if (this.shouldShowThankYouModal) {
            document.getElementById('thank-you-modal-button')?.click();
            this.shouldShowThankYouModal = false;
        }
        if (this.shouldShowWelcomeModal) {
            document.getElementById('welcome-modal-button')?.click();
            this.shouldShowWelcomeModal = false;
        }

        this.markEditor(); // TODO: instead save processedText as well?
    }

    ngOnDestroy(): void {
        this.editorContentService.editorInnerHTML =
            this.elementRef.nativeElement.querySelector('#editor').innerHTML!;

        this.eventualMarkingSubscription$.unsubscribe();
        this.eventualTextStoringSubscription$.unsubscribe();
        this.animationRemovedSubscription.unsubscribe();
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

        // TODO: is there new code that properly does here what we want?
        document.execCommand('insertText', false, text);
    }

    /**
     * Function that is called when text is copied from the editor.
     * @param {ClipboardEvent} $event the event emitted
     */
    onTextCopy($event: ClipboardEvent): void {
        $event.preventDefault();

        const editorCopiableText: string = window
            .getSelection()!
            .toString()
            .replace(/(?:\n){2,}/g, (match) => {
                return match.substring(0, match.length - 1);
            });

        // NOTE: this text/plain might be fine for now, but probably should be amended if we want to have richer text
        $event.clipboardData!.setData('text/plain', editorCopiableText);
    }

    /**
     * Function that is called when text is cut from the editor.
     * @param {ClipboardEvent} $event the event emitted
     */
    onTextCut($event: ClipboardEvent): void {
        if (
            window.getSelection()!.toString() ===
            document.getElementById(this.EDITOR_KEY)!.innerText
        ) {
            $event.preventDefault();

            const editorCopiableText: string = Array.from(
                document.getElementById(this.EDITOR_KEY)!.querySelectorAll('p')
            )
                .map((p: HTMLParagraphElement) => p.textContent)
                .join('\n');

            // NOTE: this text/plain might be fine for now, but probably should be amended if we want to have richer text
            $event.clipboardData!.setData('text/plain', editorCopiableText);

            // TODO: try to do this for partial cut as well
            this.clearEditor();
        }
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
            this.httpClient
                .post(this.uploadDocumentURL, formData)
                .subscribe((next) => {
                    this.processedText = next as ProcessedText;
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.markings.length
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
     * @param {number} markingIndex the index of the chosen Marking
     * @param {number} suggestionIndex the index of the chosen Suggestion of the above Marking
     */
    chooseSuggestion(markingIndex: number, suggestionIndex: number): void {
        // if (this.cardsToRemove.length >= 1) return; // prevents collision action between suggestion and deletion
        this.suggestedMarkingCardCounter++;
        this.cardCountSelectedPrePost++;
        this.suggestionsOfMarkingsToChoose.push({
            markingIndex: markingIndex,
            suggestionIndex
        });

        if (this.highlightedMarkingIndex >= 0) {
            this.chooseSelectedSuggestions();
            this.postSuggestedText();
            return;
        }

        this.applySlideFadeAnimationToCard(markingIndex);

        if (this.fetchEditorMarkings().length === 1) {
            setTimeout(() => {
                this.chooseSelectedSuggestions();
                this.postSuggestedText();
            }, 900);
            return;
        }

        this.suggestionChoosingSubject$.next();
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    /**
     * Dismiss the **Marking** based on the **markingIndex**.
     * @param {number} markingIndex the index of the text marking from the list of the sorted text markings
     */
    dismissMarking(markingIndex: number): void {
        // TODO: think we should rename this to dismissTextMarking or even just dismissMarking
        // based on the assumption that all spans within the paragraphs of the editor are markings
        // if (this.cardSuggestionsToRemove.length >= 1) return; // prevents collision action between suggestion and deletion

        this.storeDismissedMarking(markingIndex); // TODO: uncomment before merging

        this.cardCountSelectedPrePost++;
        this.indicesOfMarkingsToDismiss.push(markingIndex);
        this.applySlideFadeAnimationToCard(markingIndex);

        this.markingDismissalSubject$.next();
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
        this.indicesOfMarkingsToDismiss = [];
        this.suggestionsOfMarkingsToChoose = [];
        this.suggestedMarkingCardCounter = 0;
        this.markingParagraphIndex = [];
        this.characterCountPrePost = 0;
        this.cardCountSelectedPrePost = 0;
    }

    /**
     * Expand or contract the suggestions of a given Marking based on an index.
     * @param {number} markingIndex the index of the text marking from the list of the sorted text markings
     * @param {Event} $event the click event that is triggered when clicking on the expand/contract icon
     */
    oscillateSuggestion(markingIndex: number, $event: Event): void {
        const oscillatingButtonClasses: DOMTokenList = (
            $event.target as HTMLHeadingElement
        ).classList;
        if (oscillatingButtonClasses.contains('bi-arrow-right-square')) {
            if (this.shouldCollapseSuggestions[markingIndex]) {
                this.shouldCollapseSuggestions[markingIndex] = false;
            }
        } else if (oscillatingButtonClasses.contains('bi-arrow-left-square')) {
            if (!this.shouldCollapseSuggestions[markingIndex]) {
                this.shouldCollapseSuggestions[markingIndex] = true;
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

            const editorCopiableText: string = Array.from(
                document.getElementById(this.EDITOR_KEY)!.querySelectorAll('p')
            )
                .map((p: HTMLParagraphElement) => p.textContent)
                .join('\n');
            navigator.clipboard.writeText(editorCopiableText).then();
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

    toggleStoringOfWritings(): void {
        this.writingsHistoryService.toggleWritingPermission(
            (
                document.getElementById(
                    'flex-switch-check-checked'
                ) as HTMLInputElement
            ).checked
        );
    }

    /**
     * Replaces the text of the editor with the given **writtenText** and generates its markings
     * @param {string} writtenText
     */
    placeWriting(writtenText: string): void {
        document.getElementById(this.EDITOR_KEY)!.innerText = writtenText;
        document.getElementById('close-writings-history-modal-button')!.click();
        this.markEditor();
        this.updateCharacterAndWordCount();
    }

    getTextOfMarking(markingIndex: number): string {
        if (!this.processedText) {
            return this.EMPTY_STRING;
        }

        const marking: Marking = this.processedText.markings[markingIndex];
        if (!marking) {
            return this.EMPTY_STRING;
        }

        const virtualEditor: HTMLDivElement = document.createElement('div');
        virtualEditor.innerHTML = this.processedText.text;

        const editorTextContent: string | null =
            virtualEditor.childNodes[marking.paragraph!].textContent;
        if (!editorTextContent) {
            return this.EMPTY_STRING;
        }

        return editorTextContent.slice(marking.from, marking.to);
    }

    /**
     * Blurs the currently highlighted board marking.
     */
    blurHighlightedBoardMarking(): void {
        this.highlightedMarkingIndex = -1;
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.generateMarkingsURL =
            this.baseURL + '/api/generateMarkingsForParagraphs';
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
        this.pingURL = this.baseURL + '/api/ping';
    }

    /**
     * Handle animations for card suggestion in the editor.
     *
     * The animations are based on the number of cards to remove and their respective indexes.
     * It adds specific classes for single and multiple card removal animations and listens
     * for the "animationend" event to remove the animation classes after completion.
     *
     * @param {number} markingIndex - The index of the card to be removed.
     */
    private handleAnimationsOfCardsOnSuggestionChoosing(
        markingIndex: number
    ): void {
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;

        const countOfCardSuggestionsToRemove: number =
            this.suggestionsOfMarkingsToChoose.length;
        const countOfCards: number = document.querySelectorAll(
            '.generated-marking-card'
        ).length;
        // TODO when does the following occur?
        if (this.cardCountSelectedPrePost >= countOfCards) {
            this.chooseSelectedSuggestions();
            // this.postSuggestedText();
            return;
        }

        const lastIndex: number = countOfCards - 1;

        cards.forEach((card: HTMLElement, index: number) => {
            if (index >= markingIndex) {
                if (countOfCardSuggestionsToRemove === 1) {
                    card.classList.add('move-up-animation');
                    card.addEventListener(
                        this.ANIMATION_END_EVENT,
                        (): void => {
                            card.classList.remove('move-up-animation');
                            if (
                                this.suggestionsOfMarkingsToChoose &&
                                index === lastIndex
                            ) {
                                this.animationRemoved.emit();
                            }
                        }
                    );
                } else if (countOfCardSuggestionsToRemove >= 2) {
                    card.classList.add('move-up-multiple-animation');
                    card.addEventListener(
                        this.ANIMATION_END_EVENT,
                        (): void => {
                            card.classList.remove('move-up-multiple-animation');
                            if (
                                this.suggestionsOfMarkingsToChoose &&
                                index === lastIndex
                            ) {
                                this.animationRemoved.emit();
                            }
                        }
                    );
                }
            }
        });
    }

    /**
     * Evaluates readiness of cards and initiates a post request when ready.
     *
     * This method inspects the cards and determines if they're ready for further processing.
     */
    private checkForAnimationRemoval(): void {
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;

        if (
            this.isMarkingInAnimation(cards) ||
            this.suggestedMarkingCardCounter === cards.length
        ) {
            this.postSuggestedText();
        }
    }

    /**
     * Check the animation state of cards within an HTML document.
     * The presence of these classes indicates that the corresponding card is still undergoing animation.
     *
     * @param {NodeListOf<HTMLElement>} cards - A NodeList containing the HTML elements representing the cards to be checked.
     * @returns {boolean} - Returns `true` if any card in the provided list still contains the animation classes; otherwise, returns `false`.
     */
    private isMarkingInAnimation(cards: NodeListOf<HTMLElement>): boolean {
        return Array.from(cards).some(
            (card: HTMLElement) =>
                card.classList.contains('move-up-animation') ||
                card.classList.contains('move-up-multiple-animation')
        );
    }

    private filterDismissedMarkings(markings: Marking[]): Marking[] {
        const dismissedMarkings: string[] =
            (JSON.parse(
                localStorage.getItem('penda-dismissed-markings')!
            ) as string[]) ?? [];
        return markings.filter((m: Marking) => {
            const virtualEditor: HTMLDivElement = document.createElement('div');
            virtualEditor.innerHTML = this.processedText?.text!;

            const editorTextContent: string | null =
                virtualEditor.childNodes[m.paragraph!].textContent;

            const markingText: string = editorTextContent!.slice(m.from, m.to);

            return !dismissedMarkings.includes(markingText);
        });
    }

    /**
     * Post the suggested text to the server for processing and update the editor accordingly.
     *
     * This method sends the content of the editor to the server, receives processed text with markings,
     * and updates the editor's content, applying text markings and adjusting cursor position.
     * */
    private postSuggestedText(): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        this.httpClient
            .post(this.generateMarkingsURL, editor.innerHTML)
            .subscribe((next) => {
                this.processedText = next as ProcessedText;

                this.processedText.markings = this.filterUnselectedMarkingTypes(
                    this.processedText.markings
                );

                this.processedText.markings = this.filterDismissedMarkings(
                    this.processedText.markings
                );

                if (this.processedText?.markings.length != 0) {
                    this.processedText.markings = sortMarkings(
                        this.processedText.markings
                    );

                    this.tempProcessedText = JSON.parse(
                        JSON.stringify(this.processedText)
                    );
                    this.markingParagraphIndex = [];
                    this.separateParagraphIndex(this.tempProcessedText);

                    const consumableMarkings: Marking[] = Array.from(
                        this.processedText.markings
                    );

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
                            markElement(
                                p,
                                consumableMarkings.length,
                                isLastChildNode,
                                consumableMarkings.filter(
                                    (tm: Marking) => tm.paragraph === index
                                )
                            );
                        }
                    );

                    // TODO editor or childNode here? I guess we have to do the whole thing always...
                    // markText(editor, consumableTextMarkings.filter((tm: TextMarking) => tm.paragraph === textMarking.paragraph!));
                }

                if (this.isEditorActive()) {
                    this.positionCursorToEnd(editor);
                }
                this.updateCharacterAndWordCount();

                this.shouldCollapseSuggestions = new Array<boolean>(
                    this.processedText.markings.length
                ).fill(true);

                this.blurHighlightedBoardMarking();
                this.listenForMarkingHighlight();
                this.suggestionsOfMarkingsToChoose = [];
                this.characterCountPrePost = 0;
                this.suggestedMarkingCardCounter = 0;
                this.cardCountSelectedPrePost = 0;
            });
    }

    /**
     * @param tempProcessedText
     * @private
     */
    private separateParagraphIndex(
        tempProcessedText: ProcessedText | undefined
    ): void {
        let tempIndexValue: number = 0;
        tempProcessedText?.markings.forEach(
            (marking: Marking, index: number): void => {
                if (tempIndexValue > marking.to) {
                    // TODO: first comparison always fails? as the first shortest marking is from 0 to 1?
                    this.markingParagraphIndex.push(index);
                }
                tempIndexValue = marking.to;
            }
        );
    }

    /**
     * Replace a suggested node in the editor with the chosen suggestion.
     *
     * This method takes the index of the text marking and the index of the suggestion to be applied.
     * It replaces the content of the corresponding paragraph in the editor with the chosen suggestion,
     * considering the starting and ending positions of the text marking.
     */
    private chooseSelectedSuggestions(): void {
        this.suggestionsOfMarkingsToChoose.forEach(
            ({ markingIndex: mI, suggestionIndex: sI }): void => {
                const editor: HTMLElement = document.getElementById(
                    this.EDITOR_KEY
                )!;

                const marking: Marking = this.processedText!.markings[mI];
                const tempMarking: Marking =
                    this.tempProcessedText!.markings[mI];
                const childNode: ChildNode =
                    editor.childNodes[marking.paragraph!];
                const p: HTMLParagraphElement = document.createElement('p');

                const currentNode: string = childNode.textContent!.substring(
                    tempMarking.from,
                    tempMarking.to
                );
                const suggestedNode: string = marking.suggestions[sI].action;
                this.characterCountPrePost =
                    currentNode.length - suggestedNode.length;
                let counterChar: number = 0;

                childNode.childNodes.forEach((node: ChildNode): void => {
                    // Clone the child node
                    const clonedNode: Element = node.cloneNode(true) as Element;
                    counterChar += node.textContent?.length!;
                    const isWithinRange: number = Math.abs(
                        counterChar - tempMarking.to
                    );

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

                        const replacedText: string = node.textContent.replace(
                            currentNode,
                            suggestedNode
                        );

                        const newText: Text =
                            document.createTextNode(replacedText);

                        p.appendChild(newText);
                    } else {
                        p.appendChild(clonedNode);
                    }
                });

                editor.replaceChild(p, childNode);
                this.updateCharacterCount();
                this.updateWordCount();
                this.updateTempMarkings(mI);
            }
        );
    }

    /**
     * Updates the char index for all markings
     * @param {number} markingIndex selected marking index
     */
    private updateTempMarkings(markingIndex: number): void {
        if (this.characterCountPrePost === 0) return; // if no changes are needed
        const pIndexSelected = this.findRange(markingIndex);

        this.tempProcessedText!.markings.forEach((marking, index) => {
            if (
                index > markingIndex &&
                pIndexSelected[0] <= index &&
                pIndexSelected[1] > index
            ) {
                marking.from -= this.characterCountPrePost;
                marking.to -= this.characterCountPrePost;
            }
        });
    }

    private findRange(index: number): [number, number] {
        let rangeStart: number | null = null;
        let rangeEnd: number | null = null;

        for (let i: number = 0; i < this.markingParagraphIndex.length; i++) {
            if (this.markingParagraphIndex[i] <= index) {
                if (
                    rangeStart === null ||
                    this.markingParagraphIndex[i] > rangeStart
                ) {
                    rangeStart = this.markingParagraphIndex[i];
                }
            }

            if (this.markingParagraphIndex[i] > index) {
                if (
                    rangeEnd === null ||
                    this.markingParagraphIndex[i] < rangeEnd
                ) {
                    rangeEnd = this.markingParagraphIndex[i];
                }
            }
        }

        // Handle edge case for the first index and last index
        rangeEnd = rangeEnd ?? this.tempProcessedText!.markings.length;
        rangeStart = rangeStart ?? 0;

        return [rangeStart, rangeEnd];
    }

    private moveUpRemainingChosenSuggestionMarkings(): void {
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;

        this.suggestionsOfMarkingsToChoose.forEach(
            ({ markingIndex: mI, suggestionIndex: _ }) => {
                document
                    .getElementById('sticky-container')!
                    .classList.add('screen-height-delay');

                cards[mI].classList.add('card-hidden');

                this.handleAnimationsOfCardsOnSuggestionChoosing(mI);
            }
        );

        setTimeout((): void => {
            document
                .getElementById('sticky-container')!
                .classList.remove('screen-height-delay');
        }, 800);

        // don't choose suggestions on an uploaded file
        this.chooseSelectedSuggestions();

        this.suggestionsOfMarkingsToChoose = [];
    }

    // TODO rename, add docs
    private focusOnMediaMatch(mediaMatch: any): void {
        if (mediaMatch.matches) {
            document.getElementById(this.EDITOR_KEY)?.focus();
        }
    }

    /**
     * Move up and animate the remaining cards in the editor after deleting marked cards.
     *
     * This method is responsible for animating the remaining cards in the editor after
     * certain marked cards have been deleted.
     */
    private moveUpRemainingDismissedMarkings(): void {
        const markings: NodeListOf<Element> = this.fetchEditorMarkings();
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;
        const markingValues: any[] = []; // TODO: (just a note for me) basically "eshte" for the typo eshte

        this.indicesOfMarkingsToDismiss.forEach((mI: number): void => {
            const card: HTMLElement = cards[mI];
            const cardToRemove = this.extractMarkingValue(card);
            markingValues.push(cardToRemove!);

            // TODO: does this need to be done for every marking?
            document
                .getElementById('sticky-container')!
                .classList.add('screen-height-delay');

            card.classList.add('card-hidden');

            this.handleAnimationsOfCardsOnMarkingDismissal(mI);
        });

        setTimeout((): void => {
            document
                .getElementById('sticky-container')!
                .classList.remove('screen-height-delay');
        }, 800);

        markingValues.forEach((elementMarking): void => {
            markings.forEach((card: Element, index: number): void => {
                if (card.textContent === elementMarking) {
                    this.markingCardsToDismiss.push({
                        cardElement: card,
                        index
                    });
                }
            });
        });

        this.dismissSelectedMarkings();

        this.indicesOfMarkingsToDismiss = [];
        this.markingCardsToDismiss = [];
    }

    /**
     * Delete marked elements from the editor content and update processed text.
     *
     * responsible for removing marked elements from the editor's content.
     * It replaces the marked elements with their respective text content and updates
     * the processed text data accordingly.
     */
    private dismissSelectedMarkings(): void {
        // TODO: why do we have duplicates here to begin with?
        const cardsToRemoveSet: Set<number> = new Set(
            this.indicesOfMarkingsToDismiss
        );
        this.markingCardsToDismiss.forEach((cardElement): void => {
            if (cardsToRemoveSet.has(cardElement.index)) {
                const currentMarking = cardElement.cardElement;
                const textNode: Text = document.createTextNode(
                    currentMarking.textContent || ''
                );
                currentMarking.parentNode?.replaceChild(
                    textNode,
                    currentMarking
                );
            }
        });

        this.processedText!.markings = this.processedText!.markings.filter(
            (_: Marking, index: number) =>
                !this.indicesOfMarkingsToDismiss.includes(index)
        );

        this.shouldCollapseSuggestions = new Array<boolean>(
            this.processedText!.markings.length
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
     * @param {number} markingIndex - The index of the card to be removed.
     */
    private handleAnimationsOfCardsOnMarkingDismissal(
        markingIndex: number
    ): void {
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;

        cards.forEach((card: HTMLElement, index: number): void => {
            const countOfCardsToRemove: number =
                this.indicesOfMarkingsToDismiss.length;
            if (index >= markingIndex) {
                if (countOfCardsToRemove === 1) {
                    card.classList.add('move-up-animation');
                    card.addEventListener(
                        this.ANIMATION_END_EVENT,
                        (): void => {
                            card.classList.remove('move-up-animation');
                        }
                    );
                } else if (countOfCardsToRemove >= 2) {
                    card.classList.add('move-up-multiple-animation');
                    card.addEventListener(
                        this.ANIMATION_END_EVENT,
                        (): void => {
                            card.classList.remove('move-up-multiple-animation');
                        }
                    );
                }
            }
        });
    }

    /**
     * Apply slide-fade animation to a card in the editor.
     * @param {number} markingIndex - The index of the card to apply the animation.
     */
    private applySlideFadeAnimationToCard(markingIndex: number): void {
        const cards: NodeListOf<HTMLElement> = document.querySelectorAll(
            '.generated-marking-card'
        ) as NodeListOf<HTMLElement>;
        cards[markingIndex].classList.add('fade-out');

        setTimeout((): void => {
            cards[markingIndex].classList.add('card-fade');
        }, 1000);
    }

    /**
     * Returns the actual value of the marking.
     * @param {HTMLElement} card - child node
     */
    private extractMarkingValue(card: HTMLElement): any {
        return card.childNodes[0].childNodes[0].childNodes[0].textContent?.replace(
            ' ',
            ''
        );
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
        this.httpClient
            .post(this.generateMarkingsURL, editor.innerHTML)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (value) => {
                    this.processedText = value as ProcessedText;

                    this.processedText.markings =
                        this.filterUnselectedMarkingTypes(
                            this.processedText.markings
                        );

                    this.processedText.markings = this.filterDismissedMarkings(
                        this.processedText.markings
                    );

                    this.processedText.markings = sortMarkings(
                        this.processedText.markings
                    );

                    this.tempProcessedText = JSON.parse(
                        JSON.stringify(this.processedText)
                    );
                    this.markingParagraphIndex = [];
                    this.separateParagraphIndex(this.tempProcessedText);

                    const consumableMarkings: Marking[] = Array.from(
                        this.processedText.markings
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
                            markElement(
                                p,
                                consumableMarkings.length,
                                isLastChildNode,
                                consumableMarkings.filter(
                                    (tm: Marking) => tm.paragraph === index
                                )
                            );
                        }
                    );

                    this.suggestedMarkingCardCounter = 0;
                    if (this.isEditorActive()) {
                        this.positionCursor(editor, cursorPlacement);
                    }
                    this.updateCharacterAndWordCount();
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.markings.length
                    ).fill(true);
                },
                complete: () => {
                    setTimeout(() => this.listenForMarkingHighlight(), 0);
                }
            });
    }

    private filterUnselectedMarkingTypes(markings: Marking[]): Marking[] {
        return markings.filter((tM: Marking): boolean => {
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

    hasUnconventionalCharacters(): boolean {
        return this.UNCONVENTIONAL_CHARACTERS.some((uC) =>
            document.getElementById(this.EDITOR_KEY)?.innerText.includes(uC)
        );
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
                filter(() => !this.hasUnconventionalCharacters()),
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
                    this.writingsHistoryService.storeWriting(
                        document.getElementById(this.EDITOR_KEY)!.innerText
                    )
                )
            )
            .subscribe();
    }

    private subscribeForRemovedSuggestionCardAnimation(): void {
        this.animationRemovedSubscription = this.animationRemoved
            .pipe(debounceTime(this.EVENTUAL_SUGGESTION_SELECTION_POST))
            .subscribe(() => this.checkForAnimationRemoval());
    }

    private disableEditor(errorResponse: HttpErrorResponse): void {
        const errorMessage =
            errorResponse.status === 429
                ? 'Tepër kërkesa për shenjime për momentin.'
                : 'Fatkeqësisht kemi një problem me serverat. Ju kërkojmë ndjesë, ndërsa kërkojmë për një zgjidhje.';
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
        const markings: NodeListOf<Element> = document.querySelectorAll(
            '.typo,.loanword,.stylistic,.grammatical'
        );
        markings.forEach((element: Element, index: number) =>
            element.addEventListener(
                'click',
                this.highlightBoardMarking.bind(this, index)
            )
        );
    }

    /**
     * Clicking on an editor marking, highlights it in the board of markings.
     *
     * @param {number} markingIndex
     */
    private highlightBoardMarking(markingIndex: number): void {
        this.highlightedMarkingIndex = markingIndex;
    }

    private brieflyChangeClipboardIcon(
        copyToClipboardButton: HTMLElement
    ): void {
        setTimeout((): void => {
            copyToClipboardButton.classList.replace(
                'bi-clipboard2-check',
                'bi-clipboard'
            );
            copyToClipboardButton.style.color = 'black';
        }, 2 * this.SECONDS);
    }

    private addEventListenerForShortcuts(): void {
        const componentDivs: HTMLCollectionOf<Element> =
            document.getElementsByClassName('component-div');
        if (componentDivs.length !== 1) {
            return;
        }
        componentDivs[0].addEventListener('keydown', (e: Event): void => {
            const keyboardEvent: KeyboardEvent = e as KeyboardEvent;
            if (this.isEditorActive()) {
                return;
            }

            if (!keyboardEvent.ctrlKey) {
                switch (keyboardEvent.key) {
                    case 'h':
                    case 'H': {
                        (
                            document.querySelector(
                                '.bi-clock-history'
                            )! as HTMLButtonElement
                        ).click();
                        return;
                    }
                    case 'c':
                    case 'C': {
                        this.copyToClipboard();
                        return;
                    }
                    case 'm':
                    case 'M': {
                        document
                            .getElementById('off-canvas-start-button')!
                            .click();
                    }
                }
            }

            if (!this.hasMarkings()) {
                return;
            }

            if (keyboardEvent.shiftKey) {
                if (
                    keyboardEvent.code.includes('Digit') &&
                    keyboardEvent.code.length === 6 &&
                    '0' <= keyboardEvent.code[keyboardEvent.code.length - 1] &&
                    keyboardEvent.code[keyboardEvent.code.length - 1] <= '9'
                ) {
                    const digit =
                        keyboardEvent.code[
                            keyboardEvent.code.length - 1
                        ].charCodeAt(0) - 48;
                    this.highlightBoardMarking(digit - 1);
                    return;
                }
            }

            if ('0' <= keyboardEvent.key && keyboardEvent.key <= '9') {
                const digit = keyboardEvent.key.charCodeAt(0) - 48;

                this.chooseSuggestion(0, digit - 1);
                return;
            }

            switch (keyboardEvent.key) {
                case 'Escape': {
                    this.blurHighlightedBoardMarking();
                    return;
                }
                case 'd':
                case 'D': {
                    this.dismissMarking(0);
                    return;
                }
            }
        });
    }

    private hasMarkings(): boolean {
        return (
            this.processedText !== undefined &&
            this.processedText.markings.length > 0
        );
    }

    private isEditorActive(): boolean {
        return (
            document.activeElement === document.getElementById(this.EDITOR_KEY)!
        );
    }

    private showThankYouModal(): void {
        const state = this.router.getCurrentNavigation()!.extras!.state;
        if (!state) {
            return;
        }
        if (state['payload'] === 'penda-thank-you') {
            this.shouldShowThankYouModal = true;
        }
    }

    private showWelcomeModal(): void {
        const state = this.router.getCurrentNavigation()!.extras!.state;
        if (!state) {
            return;
        }
        if (state['payload'] === 'penda-welcome') {
            this.shouldShowWelcomeModal = true;
        }
    }

    private storeDismissedMarking(markingIndex: number): void {
        // TODO: collection in LS should conceptually be a set
        if (!localStorage.getItem('penda-dismissed-markings')) {
            localStorage.setItem(
                'penda-dismissed-markings',
                JSON.stringify([])
            );
        }
        const dismissedMarkings: string[] = JSON.parse(
            localStorage.getItem('penda-dismissed-markings')!
        ) as string[];
        const markingText: string = this.getTextOfMarking(markingIndex);
        dismissedMarkings.push(markingText);
        localStorage.setItem(
            'penda-dismissed-markings',
            JSON.stringify(dismissedMarkings)
        );
    }

    private fetchEditorMarkings(): NodeListOf<HTMLSpanElement> {
        return document.querySelectorAll('#editor > p > span');
    }
}
