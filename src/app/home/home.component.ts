import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    BehaviorSubject, buffer,
    debounceTime,
    filter,
    finalize,
    fromEvent, merge,
    Observable, of,
    Subject,
    tap,
} from 'rxjs'

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
import {
    DISMISSED_MARKINGS_KEY,
    DIV_TAG,
    EDITOR_ID,
    EMPTY_STRING,
    EVENTUAL_MARKING_TIME,
    EVENTUAL_WRITTEN_TEXT_STORAGE_TIME,
    filterDismissedMarkings,
    filterUnselectedMarkingTypes,
    LINE_BREAK,
    LINE_BREAK_TAG_NAME,
    LINE_BROKEN_PARAGRAPH,
    MAX_EDITOR_CHARACTERS,
    PARAGRAPH_TAG,
    PARAGRAPH_TAG_NAME,
    PLACEHOLDER_ELEMENT_ID,
    SECONDS,
    UNCONVENTIONAL_CHARACTERS,
    WRITINGS_INPUT_ID
} from '../services/constants';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    processedText: ProcessedText | undefined;
    characterCount: number = 0;
    wordCount: number = 0;
    innerHTMLOfEditor: string = LINE_BROKEN_PARAGRAPH;
    shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    highlightedMarkingIndex: number = -1;

    readonly MAX_EDITOR_CHARACTERS_MESSAGE: string = `Keni arritur kufirin e ${MAX_EDITOR_CHARACTERS} karaktereve, shkurtoni shkrimin.`;
    readonly UNCONVENTIONAL_CHARACTERS_MESSAGE: string = `Shkrimi juaj përmban karaktere jashtë standardit. Zëvendësoni këto karaktere për të gjeneruar shenjime.`;

    private dismissSubject$: Subject<any> = new Subject<any>();
    private applySubject$: Subject<any> = new Subject<any>();

    rezo: Observable<any> = of();

    private shouldShowThankYouModal: boolean = false; // TODO: exists because `this.router.getCurrentNavigation()` is not null only in the constructor
    private shouldShowWelcomeModal: boolean = false; // TODO: exists because `this.router.getCurrentNavigation()` is not null only in the constructor

    private baseURL!: string;
    private generateMarkingsURL!: string;
    private uploadDocumentURL!: string;
    private pingURL!: string;
    private savedCursorPosition: CursorPosition | undefined;
    private eventualMarkingSubscription$: any;
    private eventualTextStoringSubscription$: any;
    private fromEditorInputEvent$: any;

    constructor(
        public darkModeService: DarkModeService,
        public writingsHistoryService: WritingsHistoryService,
        private httpClient: HttpClient,
        private router: Router,
        private editorContentService: EditorContentService,
        private elementRef: ElementRef
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
        if (this.editorContentService.editorInnerHTML) {
            document.getElementById(EDITOR_ID)!.innerHTML =
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
            document.getElementById(WRITINGS_INPUT_ID) as HTMLInputElement
        ).checked = this.writingsHistoryService.canStoreWritings;

        this.fromEditorInputEvent$ = fromEvent(
            document.getElementById(EDITOR_ID)!,
            'input'
        );

        this.subscribeForWritingInTheEditor();
        this.subscribeForStoringWrittenText();

        if (this.shouldShowThankYouModal) {
            document.getElementById('thank-you-modal-button')?.click();
            this.shouldShowThankYouModal = false;
        }
        if (this.shouldShowWelcomeModal) {
            document.getElementById('welcome-modal-button')?.click();
            this.shouldShowWelcomeModal = false;
        }

        this.markEditor(); // TODO: instead save processedText as well?

        this.rezo = merge(this.dismissSubject$.asObservable(), this.applySubject$.asObservable());
        // TODO also unsubscribe this
        this.rezo.pipe(buffer(this.rezo.pipe(debounceTime(2500)))).subscribe(v => {
            console.log('v', v); // TODO
        })
    }

    ngOnDestroy(): void {
        this.editorContentService.editorInnerHTML =
            this.elementRef.nativeElement.querySelector('#editor').innerHTML!;

        this.eventualMarkingSubscription$.unsubscribe();
        this.eventualTextStoringSubscription$.unsubscribe();
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
            document.getElementById(EDITOR_ID)!.innerText
        ) {
            $event.preventDefault();

            const editorCopiableText: string = Array.from(
                document
                    .getElementById(EDITOR_ID)!
                    .querySelectorAll(PARAGRAPH_TAG)
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
        if (this.hasEditorOverMaxCharacters()) {
            if ($event.key !== 'Backspace') {
                $event.preventDefault();
            }
        }
    }

    /**
     * Updates the character count field to the number of characters shown in the editor
     */
    updateCharacterCount(): void {
        const editor: HTMLElement = document.getElementById(EDITOR_ID)!;
        if (editor.innerHTML === LINE_BROKEN_PARAGRAPH) {
            this.characterCount = 0;
            return;
        }
        this.characterCount = editor.innerText.replace(
            /\n/g,
            EMPTY_STRING
        ).length;
    }

    /**
     * Updates the word count field to the number of words shown in the editor
     */
    updateWordCount(): void {
        const editor: HTMLElement = document.getElementById(EDITOR_ID)!;
        if (editor.innerText === EMPTY_STRING) {
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
                .subscribe((value) => {
                    this.processedText = value as ProcessedText;
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.markings.length
                    ).fill(true);

                    document.getElementById(EDITOR_ID)!.innerHTML =
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
        // TODO add over-text of card here
        this.applySubject$.next({message: 'apply-suggestion', markingIndex: markingIndex, suggestionIndex: suggestionIndex});
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    /**
     * Dismiss the **Marking** based on the **markingIndex**.
     * @param {number} markingIndex the index of the text marking from the list of the sorted text markings
     */
    dismissMarking(markingIndex: number): void {
        this.storeDismissedMarking(markingIndex);
        // TODO add over-text of card here
        this.dismissSubject$.next({message: 'dismiss-marking', markingIndex: markingIndex});
    }

    /**
     * Returns whether there is text in the editor or not
     */
    editorHasText(): boolean {
        return (
            document.getElementById(EDITOR_ID)!.innerHTML !==
            LINE_BROKEN_PARAGRAPH
        );
    }

    /**
     * Returns whether there is empty text in the editor or not
     */
    editorHasEmptyText(): boolean {
        return document.getElementById(EDITOR_ID)!.innerHTML === EMPTY_STRING;
    }

    /**
     * Clears the written text in the editor
     */
    clearEditor(): void {
        document.getElementById(EDITOR_ID)!.innerHTML = LINE_BROKEN_PARAGRAPH;
        this.processedText = undefined;
        this.updateCharacterAndWordCount();
        this.shouldCollapseSuggestions = new Array<boolean>(0);
        this.blurHighlightedBoardMarking();
    }

    hasEditorUnconventionalCharacters(): boolean {
        return UNCONVENTIONAL_CHARACTERS.some((uC) =>
            document.getElementById(EDITOR_ID)?.innerText.includes(uC)
        );
    }

    hasEditorOverMaxCharacters(): boolean {
        return this.characterCount > MAX_EDITOR_CHARACTERS;
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

        const editor: HTMLElement = document.getElementById(EDITOR_ID)!;
        if (navigator.clipboard) {
            if (!editor.textContent) {
                this.brieflyChangeClipboardIcon(copyToClipboardButton);
                return;
            }

            const editorCopiableText: string = Array.from(
                document
                    .getElementById(EDITOR_ID)!
                    .querySelectorAll(PARAGRAPH_TAG)
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
            (document.getElementById(WRITINGS_INPUT_ID) as HTMLInputElement)
                .checked
        );
    }

    /**
     * Replaces the text of the editor with the given **writtenText** and generates its markings
     * @param {string} writtenText
     */
    placeWriting(writtenText: string): void {
        document.getElementById(EDITOR_ID)!.innerText = writtenText;
        document.getElementById('close-writings-history-modal-button')!.click();
        this.markEditor();
        this.updateCharacterAndWordCount();
    }

    getTextOfMarking(markingIndex: number): string {
        if (!this.processedText) {
            return EMPTY_STRING;
        }

        const marking: Marking = this.processedText.markings[markingIndex];
        if (!marking) {
            return EMPTY_STRING;
        }

        const virtualEditor: HTMLDivElement = document.createElement(DIV_TAG);
        virtualEditor.innerHTML = this.processedText.text;

        const editorTextContent: string | null =
            virtualEditor.childNodes[marking.paragraph!].textContent;
        if (!editorTextContent) {
            return EMPTY_STRING;
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

    // TODO rename, add docs
    private focusOnMediaMatch(mediaMatch: any): void {
        if (mediaMatch.matches) {
            document.getElementById(EDITOR_ID)?.focus();
        }
    }

    /**
     * Make the call to mark the editor into paragraphs.
     * @param {CursorPlacement} cursorPlacement
     * @private
     */
    private markEditor(
        cursorPlacement: CursorPlacement = CursorPlacement.LAST_SAVE
    ): void {
        this.loading$.next(true);
        this.httpClient
            .post(
                this.generateMarkingsURL,
                document.getElementById(EDITOR_ID)!.innerHTML
            )
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (value) => {
                    const editor: HTMLElement = document.getElementById(EDITOR_ID)!;
                    this.processedText = value as ProcessedText;

                    this.processedText.markings = filterUnselectedMarkingTypes(
                        this.processedText.markings
                    );

                    this.processedText.markings = filterDismissedMarkings(
                        this.processedText.markings,
                        this.processedText.text
                    );

                    this.processedText.markings = sortMarkings(this.processedText.markings);

                    const consumableMarkings: Marking[] = Array.from(
                        this.processedText.markings
                    );
                    if (cursorPlacement === CursorPlacement.LAST_SAVE) {
                        this.savedCursorPosition = this.saveCursorPosition(editor);
                    }

                    editor.childNodes.forEach((childNode: ChildNode, index: number) => {
                        const p: HTMLParagraphElement =
                            document.createElement(PARAGRAPH_TAG);
                        p.innerHTML = childNode.textContent!;
                        if (childNode.textContent === EMPTY_STRING) {
                            p.innerHTML = LINE_BREAK;
                        }
                        editor.replaceChild(p, childNode);
                        markElement(
                            p,
                            consumableMarkings.length,
                            consumableMarkings.filter(
                                (tm: Marking) => tm.paragraph === index
                            )
                        );
                    });

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
                (n.nodeName === PARAGRAPH_TAG_NAME &&
                    n.firstChild!.nodeName === LINE_BREAK_TAG_NAME &&
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
            if (node.nodeName === LINE_BREAK_TAG_NAME) {
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
     * Functions that are called on an **input** event in the editor.
     */
    private subscribeForWritingInTheEditor(): void {
        this.eventualMarkingSubscription$ = this.fromEditorInputEvent$
            .pipe(
                tap(() => this.updateCharacterAndWordCount()),
                filter(
                    (keyboardEvent: KeyboardEvent) =>
                        !shouldNotMarkEditor(keyboardEvent)
                ),
                debounceTime(EVENTUAL_MARKING_TIME),
                filter(() => !this.hasEditorOverMaxCharacters()),
                filter(() => !this.hasEditorUnconventionalCharacters()),
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
                debounceTime(EVENTUAL_WRITTEN_TEXT_STORAGE_TIME),
                tap(() =>
                    this.writingsHistoryService.storeWriting(
                        document.getElementById(EDITOR_ID)!.innerText
                    )
                )
            )
            .subscribe();
    }

    private disableEditor(errorResponse: HttpErrorResponse): void {
        const errorMessage =
            errorResponse.status === 429
                ? 'Tepër kërkesa për shenjime për momentin.'
                : 'Fatkeqësisht kemi një problem me serverat. Ju kërkojmë ndjesë, ndërsa kërkojmë për një zgjidhje.';
        (document.getElementById(EDITOR_ID) as HTMLDivElement).contentEditable =
            'false';

        const placeholderElement = document.getElementById(
            PLACEHOLDER_ELEMENT_ID
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
        }, 2 * SECONDS);
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
                            .getElementById('side-menu-start-button')!
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
        return document.activeElement === document.getElementById(EDITOR_ID)!;
    }

    private showThankYouModal(): void {
        const state = this.router.getCurrentNavigation()?.extras?.state;
        if (!state) {
            return;
        }
        if (state['payload'] === 'penda-thank-you') {
            this.shouldShowThankYouModal = true;
        }
    }

    private showWelcomeModal(): void {
        const state = this.router.getCurrentNavigation()?.extras?.state;
        if (!state) {
            return;
        }
        if (state['payload'] === 'penda-welcome') {
            this.shouldShowWelcomeModal = true;
        }
    }

    private storeDismissedMarking(markingIndex: number): void {
        // TODO: collection in LS should conceptually be a set
        if (!localStorage.getItem(DISMISSED_MARKINGS_KEY)) {
            localStorage.setItem(DISMISSED_MARKINGS_KEY, JSON.stringify([]));
        }
        const dismissedMarkings: string[] = JSON.parse(
            localStorage.getItem(DISMISSED_MARKINGS_KEY)!
        ) as string[];
        const markingText: string = this.getTextOfMarking(markingIndex);
        dismissedMarkings.push(markingText);
        localStorage.setItem(
            DISMISSED_MARKINGS_KEY,
            JSON.stringify(dismissedMarkings)
        );
    }
}
