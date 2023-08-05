import {
    AfterViewInit,
    Component,
    OnDestroy,
    ViewEncapsulation
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    finalize,
    fromEvent,
    debounceTime,
    filter,
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
    EMPTY_STRING: string = '';
    EDITOR_KEY: string = 'editor';
    PLACEHOLDER_ELEMENT_ID: string = 'editor-placeholder';
    LINE_BREAK: string = '<br>';
    LINE_BROKEN_PARAGRAPH: string = '<p>' + this.LINE_BREAK + '</p>';
    EDITOR_PLACEHOLDER_TEXT: string = 'Shkruaj këtu ose ngarko një dokument.';
    writeTextToggleButtonID: string = 'writeTextToggleButton';
    uploadDocumentToggleButtonID: string = 'uploadDocumentToggleButton';
    processedText: ProcessedText | undefined;
    displayWriteTextOrUploadDocumentFlag: boolean = true;
    characterCount: number = 0;
    wordCount: number = 0;
    innerHTMLOfEditor: string = this.LINE_BROKEN_PARAGRAPH;
    shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
    loading$ = new BehaviorSubject<boolean>(false);
    editorElement!: HTMLElement;
    highlightingMarking: boolean = false;
    highlightedMarking: TextMarking | undefined = undefined;
    highlightedMarkingIndex: number = -1;

    private placeHolderElement!: HTMLElement;
    private baseURL!: string;
    private generateMarkingsURL!: string;
    private uploadDocumentURL!: string;
    private pingURL!: string;
    private savedCursorPosition: CursorPosition | undefined;
    private eventualMarkingSubscription$: any;
    private eventualTextStoringSubscription$: any;
    private fromKeyupEvent$: any;

    constructor(
        public localStorageService: LocalStorageService,
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();

        this.http.get(this.pingURL).subscribe({
            next: () => console.log('pinging server...'),
            error: () => this.disableEditor()
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

        this.fromKeyupEvent$ = fromEvent(
            document.getElementById(this.EDITOR_KEY)!,
            'keyup'
        );

        this.subscribeForWritingInTheEditor();
        this.subscribeForStoringWrittenText();
    }

    ngOnDestroy(): void {
        this.eventualMarkingSubscription$.unsubscribe();

        this.eventualTextStoringSubscription$.unsubscribe();
    }

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.generateMarkingsURL =
            this.baseURL + '/api/generateMarkingsForParagraphs';
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
        this.pingURL = this.baseURL + '/api/ping';
    }

    // TODO this, along with the toggleUploadDocumentButton function surely can be improved
    toggleWriteTextButton(): void {
        const writeTextToggleButton = document.getElementById(
            this.writeTextToggleButtonID
        );
        const uploadDocumentToggleButton = document.getElementById(
            this.uploadDocumentToggleButtonID
        );

        if (!writeTextToggleButton?.classList.contains('active')) {
            uploadDocumentToggleButton?.classList.remove(
                'active',
                'btn-secondary'
            );
            uploadDocumentToggleButton?.classList.add('btnUnselected');

            writeTextToggleButton?.classList.remove('btnUnselected');
            writeTextToggleButton?.classList.add('active', 'btn-secondary');

            if (this.innerHTMLOfEditor === this.LINE_BROKEN_PARAGRAPH) {
                // in the scenario that a file has been uploaded
                this.processedText = undefined;
            }

            this.displayWriteTextOrUploadDocumentFlag = true;
        }

        // TODO refactor!
        setTimeout(() => {
            this.fromKeyupEvent$ = fromEvent(
                document.getElementById(this.EDITOR_KEY)!,
                'keyup'
            );
            this.subscribeForWritingInTheEditor();
            this.subscribeForStoringWrittenText();
        }, 100);
    }

    // TODO this, along with the toggleWriteTextButton function surely can be improved
    toggleUploadDocumentButton(): void {
        const writeTextToggleButton = document.getElementById(
            this.writeTextToggleButtonID
        );
        const uploadDocumentToggleButton = document.getElementById(
            this.uploadDocumentToggleButtonID
        );

        if (!uploadDocumentToggleButton?.classList.contains('active')) {
            this.innerHTMLOfEditor = document.getElementById(
                this.EDITOR_KEY
            )!.innerHTML;

            writeTextToggleButton?.classList.remove('active', 'btn-secondary');
            writeTextToggleButton?.classList.add('btnUnselected');

            uploadDocumentToggleButton?.classList.remove('btnUnselected');
            uploadDocumentToggleButton?.classList.add(
                'active',
                'btn-secondary'
            );

            this.displayWriteTextOrUploadDocumentFlag = false;
        }
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

        this.localStorageService.storeWrittenText(text);

        // DELETE: after strongly typing you can see the issue identified
        // positioning cursor based on event.key makes no sense here as for this onPaste event there is no key related to it
        this.markEditor(CursorPlacement.END);
        this.updateCharacterAndWordCount();
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
        this.characterCount = document
            .getElementById(this.EDITOR_KEY)!
            .innerText.replace(/\n/g, this.EMPTY_STRING).length;
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
                    this.innerHTMLOfEditor = this.LINE_BROKEN_PARAGRAPH; // TODO careful with the <br> here
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
        // don't choose suggestions on an uploaded file
        if (!this.displayWriteTextOrUploadDocumentFlag) {
            return;
        }

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;

        const textMarking: TextMarking =
            this.processedText!.textMarkings[textMarkingIndex];
        const childNode: ChildNode = editor.childNodes[textMarking.paragraph!];
        const p = document.createElement('p');

        const writtenText = childNode.textContent!;
        const leftWrittenText = writtenText.slice(0, textMarking.from);
        const rightWrittenText = writtenText.slice(
            textMarking.to,
            writtenText.length
        );

        p.innerHTML =
            leftWrittenText +
            textMarking.suggestions[suggestionIndex].action +
            rightWrittenText;
        if (childNode.textContent === this.EMPTY_STRING) {
            p.innerHTML = this.LINE_BREAK;
        }
        editor.replaceChild(p, childNode); // TODO keep in mind that this nullifies other markings in this p as well

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
                    const consumableTextMarkings: TextMarking[] = Array.from(
                        this.processedText.textMarkings
                    );

                    editor.childNodes.forEach(
                        (childNode: ChildNode, index: number) => {
                            const p = document.createElement('p');
                            p.innerHTML = childNode.textContent!;
                            if (childNode.textContent === this.EMPTY_STRING) {
                                p.innerHTML = this.LINE_BREAK;
                            }
                            editor.replaceChild(p, childNode);
                            markText(
                                p,
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

                this.blurFocusedRightSideMarking();
            });
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    /**
     * Delete the **TextMarking** based on the **textMarkingIndex**.
     * @param {number} textMarkingIndex the index of the text marking from the list of the sorted text markings
     */
    deleteTextMarking(textMarkingIndex: number): void {
        if (this.displayWriteTextOrUploadDocumentFlag) {
            // based on the assumption that all spans within the paragraphs of the editor are markings
            const currentTextMarking =
                document.querySelectorAll('#editor > p > span')[
                    textMarkingIndex
                ];
            currentTextMarking.parentNode!.replaceChild(
                document.createTextNode(currentTextMarking.textContent!),
                currentTextMarking
            );
        }

        this.processedText!.textMarkings =
            this.processedText!.textMarkings.filter(
                (tM) =>
                    tM !== this.processedText!.textMarkings[textMarkingIndex]
            );
        this.shouldCollapseSuggestions = new Array<boolean>(
            this.processedText!.textMarkings.length
        ).fill(true);
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
        this.blurFocusedRightSideMarking();
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
        copyToClipboardButton.style.color = 'green';

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (navigator.clipboard) {
            if (!editor.textContent) {
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

        setTimeout(() => {
            copyToClipboardButton.classList.replace(
                'bi-clipboard2-check',
                'bi-clipboard'
            );
            copyToClipboardButton.style.color = 'black';
        }, 2 * this.SECONDS);
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
        const textMarking: TextMarking | null = this.processedText
            ? this.processedText.textMarkings[textMarkingIndex]
            : null;
        if (!textMarking) {
            return this.EMPTY_STRING;
        }

        if (!this.displayWriteTextOrUploadDocumentFlag) {
            if (!this.processedText) {
                return this.EMPTY_STRING;
            }

            if (
                textMarking.paragraph === undefined ||
                textMarking.paragraph === null
            ) {
                return this.processedText.text.slice(
                    textMarking.from,
                    textMarking.to
                );
            }

            const simulatedEditor: HTMLDivElement =
                document.createElement('div');
            simulatedEditor.innerHTML = this.processedText.text;
            return simulatedEditor.childNodes[
                textMarking.paragraph
            ].textContent!.slice(textMarking.from, textMarking.to);
        } else {
            const editor: HTMLElement | null = document.getElementById(
                this.EDITOR_KEY
            );
            if (!editor) {
                return this.EMPTY_STRING;
            }

            if (
                textMarking.paragraph === undefined ||
                textMarking.paragraph === null
            ) {
                return this.EMPTY_STRING;
            }

            const editorTextContent: string | null =
                editor.childNodes[textMarking.paragraph].textContent;
            if (!editorTextContent) {
                return this.EMPTY_STRING;
            }

            return editorTextContent.slice(textMarking.from, textMarking.to);
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
                    const consumableTextMarkings: TextMarking[] = Array.from(
                        this.processedText.textMarkings
                    );
                    if (cursorPlacement === CursorPlacement.LAST_SAVE) {
                        this.savedCursorPosition =
                            this.saveCursorPosition(editor);
                    }

                    editor.childNodes.forEach(
                        (childNode: ChildNode, index: number) => {
                            const p: HTMLParagraphElement =
                                document.createElement('p');
                            p.innerHTML = childNode.textContent!;
                            if (childNode.textContent === this.EMPTY_STRING) {
                                p.innerHTML = this.LINE_BREAK;
                            }
                            editor.replaceChild(p, childNode);
                            markText(
                                p,
                                consumableTextMarkings.filter(
                                    (tm: TextMarking) => tm.paragraph === index
                                )
                            );
                        }
                    );

                    this.positionCursor(editor, cursorPlacement);
                    this.shouldCollapseSuggestions = new Array<boolean>(
                        this.processedText.textMarkings.length
                    ).fill(true);
                },
                complete: () => {
                    setTimeout(() => this.listenForMarkingFocus(), 0);
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
     * Checks if the given emitted event key is included in a list of key non-triggers in order to not mark the editor.
     * For example pressing one of the arrow keys in the keyboard should not alter the editor's markings.
     * @param {KeyboardEvent} keyboardEvent from the keyup in the editor
     * @private
     * @returns {boolean} true if the editor should be not marked, false otherwise
     */
    private shouldNotMarkEditor(keyboardEvent: KeyboardEvent): boolean {
        const eventKey: string = keyboardEvent.key;
        const NON_TRIGGERS: string[] = [
            'Control',
            'CapsLock',
            'Shift',
            'Alt',
            'ArrowRight',
            'ArrowUp',
            'ArrowLeft',
            'ArrowDown'
        ];
        const copyOrPasteEvent: boolean =
            keyboardEvent.ctrlKey &&
            (eventKey === 'v' ||
                eventKey === 'V' ||
                eventKey === 'c' ||
                eventKey === 'C');
        return NON_TRIGGERS.includes(eventKey) || copyOrPasteEvent;
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
     * Functions that are called on a **KeyboardEvent** in the editor.
     */
    private subscribeForWritingInTheEditor(): void {
        this.eventualMarkingSubscription$ = this.fromKeyupEvent$
            .pipe(
                tap(() => {
                    this.updateCharacterAndWordCount();
                }),
                filter(
                    (keyboardEvent: KeyboardEvent) =>
                        !this.shouldNotMarkEditor(keyboardEvent)
                ),
                debounceTime(this.EVENTUAL_MARKING_TIME),
                tap(() => {
                    this.blurFocusedRightSideMarking();
                    this.markEditor();
                })
            )
            .subscribe();
    }

    private subscribeForStoringWrittenText(): void {
        this.eventualTextStoringSubscription$ = this.fromKeyupEvent$
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

    disableEditor(): void {
        (
            document.getElementById(this.EDITOR_KEY) as HTMLDivElement
        ).contentEditable = 'false';

        document.getElementById(this.PLACEHOLDER_ELEMENT_ID)!.innerText =
            'Fatkeqësisht kemi një problem me serverat. Ju kërkojmë ndjesë, ndërsa kërkojme për një zgjidhje.';

        (
            document.querySelectorAll(
                '.card-header button'
            ) as NodeListOf<HTMLButtonElement>
        ).forEach((b) => (b.disabled = true));
    }

    listenForMarkingFocus(): void {
        const textMarkings = document.querySelectorAll('#editor > p > .typo');
        textMarkings.forEach((element: Element, index: number) =>
            element.addEventListener(
                'click',
                this.focusRightSideMarking.bind(this, index)
            )
        );
    }

    /**
     * Clicking on the LHS, focuses on the RHS.
     *
     * @param textMarkingIndex
     */
    focusRightSideMarking(textMarkingIndex: number): void {
        this.highlightingMarking = true;
        this.highlightedMarking =
            this.processedText?.textMarkings[textMarkingIndex];
        this.highlightedMarkingIndex = textMarkingIndex;
    }

    blurFocusedRightSideMarking(): void {
        this.highlightingMarking = false;
        this.highlightedMarkingIndex = -1;
        this.highlightedMarking = undefined;
    }
}
