import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    LOCAL_STORAGE_WRITTEN_TEXT_KEY: string = 'penda-can-store-written-texts';
    WRITTEN_TEXTS_LENGTH = 5;
    WRITTEN_TEXTS_PREFIX = 'penda-written-text-';
    WRITTEN_TEXTS_KEYS: string[] = Array(this.WRITTEN_TEXTS_LENGTH)
        .fill(this.WRITTEN_TEXTS_PREFIX)
        .map((s: string, i: number) => s + i.toString());
    canStoreWrittenTexts: boolean = true;

    // save last n "writings" te local storage
    // a writing is defined as whenever you paste something, or click outside the editor
    // only save the innerText of the editor

    // the code in this service is simple (we might get performance issues if we stringify and parse an array/map), and
    // hardly extendable, consider refining in the future
    constructor() {
        const alreadyCanStoreWrittenTexts = localStorage.getItem(
            this.LOCAL_STORAGE_WRITTEN_TEXT_KEY
        );
        if (!alreadyCanStoreWrittenTexts) {
            if (this.canStoreWrittenTexts) {
                localStorage.setItem(
                    this.LOCAL_STORAGE_WRITTEN_TEXT_KEY,
                    'true'
                );
            }
        }
        if (alreadyCanStoreWrittenTexts === 'false') {
            this.canStoreWrittenTexts = false;
        }
    }

    toggleWritingPermission(checked: boolean): void {
        if (!checked) {
            this.clearWrittenTexts();
        }
        this.canStoreWrittenTexts = checked;
        localStorage.setItem(
            this.LOCAL_STORAGE_WRITTEN_TEXT_KEY,
            checked.toString()
        );
    }

    fetchWrittenTextsHistory(): Array<string> {
        const writtenTextsHistory: Array<string> = [];
        if (!this.canStoreWrittenTexts) {
            this.clearWrittenTexts();
            return writtenTextsHistory;
        }

        for (let i = 0; i < this.WRITTEN_TEXTS_KEYS.length; i++) {
            const writtenTextIndex = localStorage.getItem(
                this.WRITTEN_TEXTS_KEYS[i]
            );
            if (!writtenTextIndex) {
                return writtenTextsHistory;
            }
            writtenTextsHistory.push(writtenTextIndex);
        }

        return writtenTextsHistory;
    }

    /**
     * Stores the given text in the Local Storage.
     * @param writtenText
     */
    storeWrittenText(writtenText: string): void {
        const arr: string[] = [];
        for (let i = 0; i < this.WRITTEN_TEXTS_LENGTH; i++) {
            arr.push(localStorage.getItem(this.WRITTEN_TEXTS_KEYS[i])!);
            if (!arr[arr.length - 1]) {
                for (let j = i; j >= 0; j--) {
                    if (j === 0) {
                        localStorage.setItem(
                            this.WRITTEN_TEXTS_KEYS[j],
                            writtenText
                        );
                    } else {
                        localStorage.setItem(
                            this.WRITTEN_TEXTS_KEYS[j],
                            arr[j - 1]
                        );
                    }
                }
                return;
            }
        }

        for (let i = this.WRITTEN_TEXTS_LENGTH - 1; i >= 0; i--) {
            if (i === 0) {
                localStorage.setItem(this.WRITTEN_TEXTS_KEYS[i], writtenText);
            } else {
                localStorage.setItem(this.WRITTEN_TEXTS_KEYS[i], arr[i - 1]);
            }
        }
    }

    private clearWrittenTexts() {
        for (let index = 0; index < this.WRITTEN_TEXTS_KEYS.length; index++) {
            localStorage.removeItem(this.WRITTEN_TEXTS_KEYS[index]);
        }
    }
}

// import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {
//     BehaviorSubject,
//     Subject,
//     interval,
//     finalize,
//     switchMap,
//     take
// } from 'rxjs';
//
// import { BasicAbstractRange } from '../models/basic-abstract-range';
// import { CursorPosition } from '../models/cursor-positioning';
// import { LocalStorageService } from '../local-storage/local-storage.service';
// import { ProcessedText } from '../models/processed-text';
// import { TextMarking } from '../models/text-marking';
// import { environment } from '../../environments/environment';
// import {
//     markText,
//     sortParagraphedTextMarkings
// } from '../text-marking/text-marking';
//
// @Component({
//     selector: 'app-home',
//     templateUrl: './home.component.html',
//     styleUrls: ['./home.component.css'],
//     encapsulation: ViewEncapsulation.None
// })
// export class HomeComponent implements AfterViewInit {
//     SECONDS: number = 1000;
//     EVENTUAL_MARKING_TIME: number = 2 * this.SECONDS;
//     EMPTY_STRING: string = '';
//     EDITOR_KEY: string = 'editor';
//     PLACEHOLDER_ELEMENT_ID: string = 'editor-placeholder';
//     LINE_BREAK = '<br>';
//     LINE_BROKEN_PARAGRAPH: string = '<p>' + this.LINE_BREAK + '</p>';
//     EDITOR_PLACEHOLDER_TEXT: string = 'Shkruaj këtu ose ngarko një dokument.';
//     writeTextToggleButtonID: string = 'writeTextToggleButton';
//     uploadDocumentToggleButtonID: string = 'uploadDocumentToggleButton';
//     processedText: ProcessedText | undefined;
//     displayWriteTextOrUploadDocumentFlag: any = true;
//     characterCount: number = 0;
//     wordCount: number = 0;
//     innerHTMLOfEditor: string = this.LINE_BROKEN_PARAGRAPH;
//     shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
//     loading$ = new BehaviorSubject<boolean>(false);
//
//     private placeHolderElement!: HTMLElement;
//     private editorElement!: HTMLElement;
//     private baseURL!: string;
//     private generateMarkingsURL!: string;
//     private uploadDocumentURL!: string;
//     private pingURL!: string;
//     private hasStoppedTypingForStoringWrittenTexts: boolean = true; // stopped typing after some seconds
//     private hasStoppedTypingForEventualMarking: boolean = true; // stopped typing after some seconds
//     private makeRequestForStoringWrittenTexts$ = new Subject<void>();
//     private makeRequestForEventualMarking$ = new Subject<void>();
//     private cancelEventualMarking: boolean = false;
//     private savedSelection: BasicAbstractRange | undefined;
//     private someRange: any
//     private sC: any
//     private eC: any
//
//     constructor(
//         public localStorageService: LocalStorageService,
//         private http: HttpClient
//     ) {
//         this.initializeURLs();
//         // should any other call be made here? probably not... actually even this should be removed soon
//         this.http.get(this.pingURL).subscribe(() => {
//             console.log('pinging server...');
//         });
//     }
//
//     ngAfterViewInit(): void {
//         // save reference and reuse variable instead of reinitializing multiple times
//         this.editorElement = document.getElementById(this.EDITOR_KEY)!;
//         this.placeHolderElement = document.getElementById(
//             this.PLACEHOLDER_ELEMENT_ID
//         )!;
//         const minWidthMatchMedia: MediaQueryList =
//             window.matchMedia('(min-width: 800px)');
//         this.focusOnMediaMatch(minWidthMatchMedia);
//         // TODO some browsers still seem to use this deprecated method, keep it around for some more time
//         minWidthMatchMedia.addListener(this.focusOnMediaMatch);
//         (document.getElementById('flexSwitchCheckChecked') as any).checked =
//             this.localStorageService.canStoreWrittenTexts;
//     }
//
//     initializeURLs(): void {
//         this.baseURL = environment.baseURL;
//         this.generateMarkingsURL =
//             this.baseURL + '/api/generateMarkingsForParagraphs';
//         this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
//         this.pingURL = this.baseURL + '/api/ping';
//     }
//
//     // TODO this, along with the toggleUploadDocumentButton function surely can be improved
//     toggleWriteTextButton(): void {
//         const writeTextToggleButton = document.getElementById(
//             this.writeTextToggleButtonID
//         );
//         const uploadDocumentToggleButton = document.getElementById(
//             this.uploadDocumentToggleButtonID
//         );
//
//         if (!writeTextToggleButton?.classList.contains('active')) {
//             uploadDocumentToggleButton?.classList.remove(
//                 'active',
//                 'btn-secondary'
//             );
//             uploadDocumentToggleButton?.classList.add('btnUnselected');
//
//             writeTextToggleButton?.classList.remove('btnUnselected');
//             writeTextToggleButton?.classList.add('active', 'btn-secondary');
//
//             if (this.innerHTMLOfEditor === this.LINE_BROKEN_PARAGRAPH) {
//                 // in the scenario that a file has been uploaded
//                 this.processedText = undefined;
//             }
//
//             this.displayWriteTextOrUploadDocumentFlag = true;
//         }
//     }
//
//     // TODO this, along with the toggleWriteTextButton function surely can be improved
//     toggleUploadDocumentButton(): void {
//         const writeTextToggleButton = document.getElementById(
//             this.writeTextToggleButtonID
//         );
//         const uploadDocumentToggleButton = document.getElementById(
//             this.uploadDocumentToggleButtonID
//         );
//
//         if (!uploadDocumentToggleButton?.classList.contains('active')) {
//             this.innerHTMLOfEditor = document.getElementById(
//                 this.EDITOR_KEY
//             )!.innerHTML;
//
//             writeTextToggleButton?.classList.remove('active', 'btn-secondary');
//             writeTextToggleButton?.classList.add('btnUnselected');
//
//             uploadDocumentToggleButton?.classList.remove('btnUnselected');
//             uploadDocumentToggleButton?.classList.add(
//                 'active',
//                 'btn-secondary'
//             );
//
//             this.displayWriteTextOrUploadDocumentFlag = false;
//         }
//     }
//
//     /**
//      * Function that is called on a **KeyboardEvent** in the editor.
//      * @param {KeyboardEvent} $event
//      */
//     onKeyboardEvent($event: KeyboardEvent): void {
//         if (this.shouldNotMarkEditor($event.key)) {
//             return;
//         }
//         this.updatePlaceholder();
//
//         this.updateCharacterAndWordCount();
//         if (this.shouldMarkEditor($event.key)) {
//             this.markEditor($event.key);
//             this.cancelEventualMarking = true;
//         } else {
//             this.cancelEventualMarking = false;
//             this.markEditorEventually($event);
//         }
//         this.handleRequestForStoringWrittenTexts();
//     }
//
//     /**
//      * Function that is called when text is pasted in the editor.
//      * @param {ClipboardEvent} $event the event emitted
//      */
//     onTextPaste($event: ClipboardEvent): void {
//         $event.preventDefault();
//         if (!$event.clipboardData) {
//             return;
//         }
//         const text: string = $event.clipboardData.getData('text/plain');
//
//         document.execCommand('insertText', false, text);
//
//         this.localStorageService.storeWrittenText(text);
//
//         // DELETE: after strongly typing you can see the issue identified
//         // positioning cursor based on event.key makes no sense here as for this onPaste event there is no key related to it
//         this.markEditor(this.EMPTY_STRING, CursorPosition.END);
//         this.updateCharacterAndWordCount();
//     }
//
//     /**
//      * Updates the character count field to the number of characters shown in the editor
//      */
//     updateCharacterCount(): void {
//         const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
//         // for the scenario of the default text being <p><br></p> and this method being triggered by shift, ctrl, ...
//         if (
//             editor.innerText.length === 1 &&
//             editor.innerText.charCodeAt(0) === 10
//         ) {
//             return;
//         }
//         this.characterCount = document.getElementById(
//             this.EDITOR_KEY
//         )!.innerText.length;
//     }
//
//     /**
//      * Updates the word count field to the number of characters shown in the editor
//      */
//     updateWordCount(): void {
//         const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
//         if (editor.innerText === '') {
//             this.wordCount = 0;
//         } else {
//             const wordMatches = editor.innerText.match(/\b(\w+)\b/g)!;
//             if (wordMatches) {
//                 this.wordCount = wordMatches.length;
//             } else {
//                 this.wordCount = 0;
//             }
//         }
//     }
//
//     /**
//      * Uploads the selected document to be marked
//      * @param {Event} $event the event emitted when the file is selected
//      */
//     uploadDocument($event: Event): void {
//         const fileList: FileList | null = ($event.target as HTMLInputElement)
//             .files;
//         if (fileList && fileList.length === 1) {
//             const file: File = fileList[0];
//             const formData: FormData = new FormData();
//             formData.append('uploadFile', file, file.name);
//             this.http
//                 .post(this.uploadDocumentURL, formData)
//                 .subscribe((next) => {
//                     this.processedText = next as ProcessedText;
//                     this.shouldCollapseSuggestions = new Array<boolean>(
//                         this.processedText.textMarkings.length
//                     ).fill(true);
//                     this.innerHTMLOfEditor = this.LINE_BROKEN_PARAGRAPH; // TODO careful with the <br> here
//                 });
//         } else {
//             alert('Ngarko vetëm një dokument!');
//         }
//     }
//
//     /**
//      * Apply the chosen suggestion in the editor.
//      * @param {number} textMarkingIndex the index of the chosen TextMarking
//      * @param {number} suggestionIndex the index of the chosen Suggestion of the above TextMarking
//      */
//     chooseSuggestion(textMarkingIndex: number, suggestionIndex: number): void {
//         // don't choose suggestions on an uploaded file
//         if (!this.displayWriteTextOrUploadDocumentFlag) {
//             return;
//         }
//
//         const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
//
//         const textMarking: TextMarking =
//             this.processedText!.textMarkings[textMarkingIndex];
//         const childNode: ChildNode = editor.childNodes[textMarking.paragraph!];
//         const p = document.createElement('p');
//
//         const writtenText = childNode.textContent!;
//         const leftWrittenText = writtenText.slice(0, textMarking.from);
//         const rightWrittenText = writtenText.slice(
//             textMarking.to,
//             writtenText.length
//         );
//
//         p.innerHTML =
//             leftWrittenText +
//             textMarking.suggestions[suggestionIndex].action +
//             rightWrittenText;
//         if (childNode.textContent === this.EMPTY_STRING) {
//             p.innerHTML = this.LINE_BREAK;
//         }
//         editor.replaceChild(p, childNode); // TODO keep in mind that this nullifies other markings in this p as well
//
//         this.http
//             .post(this.generateMarkingsURL, editor.innerHTML)
//             .subscribe((next) => {
//                 this.processedText = next as ProcessedText;
//
//                 if (this.processedText?.textMarkings.length != 0) {
//                     this.processedText.textMarkings =
//                         sortParagraphedTextMarkings(
//                             this.processedText.textMarkings
//                         );
//                     const consumableTextMarkings: TextMarking[] = Array.from(
//                         this.processedText.textMarkings
//                     );
//
//                     editor.childNodes.forEach(
//                         (childNode: ChildNode, index: number) => {
//                             const p = document.createElement('p');
//                             p.innerHTML = childNode.textContent!;
//                             if (childNode.textContent === this.EMPTY_STRING) {
//                                 p.innerHTML = this.LINE_BREAK;
//                             }
//                             editor.replaceChild(p, childNode);
//                             markText(
//                                 p,
//                                 consumableTextMarkings.filter(
//                                     (tm: TextMarking) => tm.paragraph === index
//                                 )
//                             );
//                         }
//                     );
//
//                     // TODO editor or childNode here? I guess we have to do the whole thing always...
//                     // markText(editor, consumableTextMarkings.filter((tm: TextMarking) => tm.paragraph === textMarking.paragraph!));
//                 }
//                 this.positionCursorToEnd(editor);
//
//                 this.updateCharacterAndWordCount();
//                 this.shouldCollapseSuggestions = new Array<boolean>(
//                     this.processedText.textMarkings.length
//                 ).fill(true);
//             });
//     }
//
//     // TODO there might be a bug here that creates double spaces in the text, test more
//     /**
//      * Delete the **TextMarking** based on the **textMarkingIndex**.
//      * @param {number} textMarkingIndex the index of the text marking from the list of the sorted text markings
//      */
//     deleteTextMarking(textMarkingIndex: number): void {
//         if (this.displayWriteTextOrUploadDocumentFlag) {
//             const editor: HTMLElement = document.getElementById(
//                 this.EDITOR_KEY
//             )!;
//             editor.replaceChild(
//                 document.createTextNode(
//                     editor.children[textMarkingIndex].textContent!
//                 ),
//                 editor.children[textMarkingIndex]
//             );
//         }
//
//         this.processedText!.textMarkings =
//             this.processedText!.textMarkings.filter(
//                 (tM) =>
//                     tM !== this.processedText!.textMarkings[textMarkingIndex]
//             );
//         this.shouldCollapseSuggestions = new Array<boolean>(
//             this.processedText!.textMarkings.length
//         ).fill(true);
//     }
//
//     /**
//      * Returns whether there is text in the editor or not
//      */
//     editorHasText(): boolean {
//         return (
//             document.getElementById(this.EDITOR_KEY)!.innerHTML !==
//             this.LINE_BROKEN_PARAGRAPH
//         );
//     }
//
//     /**
//      * Clears the written text in the editor
//      */
//     clearEditor(): void {
//         document.getElementById(this.EDITOR_KEY)!.innerHTML =
//             this.LINE_BROKEN_PARAGRAPH;
//         this.updatePlaceholder();
//         this.processedText = undefined;
//         this.updateCharacterAndWordCount();
//         this.shouldCollapseSuggestions = new Array<boolean>(0);
//     }
//
//     /**
//      * Expand or contract the suggestions of a given TextMarking based on an index.
//      * @param {number} textMarkingIndex the index of the text marking from the list of the sorted text markings
//      * @param {Event} $event the click event that is triggered when clicking on the expand/contract icon
//      */
//     oscillateSuggestion(textMarkingIndex: number, $event: Event): void {
//         const oscillatingButtonClasses: DOMTokenList = (
//             $event.target as HTMLHeadingElement
//         ).classList;
//         if (oscillatingButtonClasses.contains('bi-arrow-right-square')) {
//             if (this.shouldCollapseSuggestions[textMarkingIndex]) {
//                 this.shouldCollapseSuggestions[textMarkingIndex] = false;
//             }
//         } else if (oscillatingButtonClasses.contains('bi-arrow-left-square')) {
//             if (!this.shouldCollapseSuggestions[textMarkingIndex]) {
//                 this.shouldCollapseSuggestions[textMarkingIndex] = true;
//             }
//         } else {
//             throw new Error(
//                 'The oscillating button should have one of these classes given that you could see it to click it!'
//             );
//         }
//     }
//
//     copyToClipboard(): void {
//         const copyToClipboardButton: HTMLElement = document.getElementById(
//             'copyToClipboardButton'
//         )!;
//         copyToClipboardButton.classList.replace(
//             'bi-clipboard',
//             'bi-clipboard2-check'
//         );
//         copyToClipboardButton.style.color = 'green';
//
//         const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
//         let range, select: Selection;
//         if (document.createRange) {
//             range = document.createRange();
//             range.selectNodeContents(editor);
//             select = window.getSelection()!;
//             select.removeAllRanges();
//             select.addRange(range);
//             document.execCommand('copy');
//             select.removeAllRanges();
//         } else {
//             range = (document.body as any).createTextRange();
//             range.moveToElementText(editor);
//             range.select();
//             document.execCommand('copy');
//         }
//
//         setTimeout(() => {
//             copyToClipboardButton.classList.replace(
//                 'bi-clipboard2-check',
//                 'bi-clipboard'
//             );
//             copyToClipboardButton.style.color = 'black';
//         }, 2 * this.SECONDS);
//     }
//
//     toggleStoringOfWrittenTexts(): void {
//         this.localStorageService.toggleWritingPermission(
//             (document.getElementById('flexSwitchCheckChecked') as any).checked
//         );
//     }
//
//     focusOnMediaMatch(mediaMatch: any): void {
//         if (mediaMatch.matches) {
//             document.getElementById(this.EDITOR_KEY)?.focus();
//         }
//     }
//
//     /**
//      * Replaces the text of the editor with the given **writtenText** and generates its markings
//      * @param {string} writtenText
//      */
//     placeWrittenText(writtenText: string): void {
//         document.getElementById(this.EDITOR_KEY)!.innerText = writtenText;
//         document.getElementById('closeWrittenTextsModalButton')!.click();
//         this.markEditor();
//         this.updateCharacterAndWordCount();
//     }
//
//     getTextOfTextMarking(textMarkingIndex: number): string {
//         const textMarking: TextMarking | null = this.processedText
//             ? this.processedText.textMarkings[textMarkingIndex]
//             : null;
//         if (!textMarking) {
//             return this.EMPTY_STRING;
//         }
//
//         if (!this.displayWriteTextOrUploadDocumentFlag) {
//             if (!this.processedText) {
//                 return this.EMPTY_STRING;
//             }
//
//             return this.processedText.text.slice(
//                 textMarking.from,
//                 textMarking.to
//             );
//         } else {
//             const editor: HTMLElement | null = document.getElementById(
//                 this.EDITOR_KEY
//             );
//             if (!editor) {
//                 return this.EMPTY_STRING;
//             }
//
//             if (
//                 textMarking.paragraph === undefined ||
//                 textMarking.paragraph === null
//             ) {
//                 return this.EMPTY_STRING;
//             }
//
//             const editorTextContent: string | null =
//                 editor.childNodes[textMarking.paragraph].textContent;
//             if (!editorTextContent) {
//                 return this.EMPTY_STRING;
//             }
//
//             return editorTextContent.slice(textMarking.from, textMarking.to);
//         }
//     }
//
//     /**
//      * Make the call to mark the editor into paragraphs.
//      * @param {string} eventKey
//      * @param {CursorPosition} cursorPosition
//      * @private
//      */
//     private markEditor(
//         eventKey: string = this.EMPTY_STRING,
//         cursorPosition: CursorPosition = CursorPosition.LAST_SAVE
//     ): void {
//         const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
//
//         this.loading$.next(true);
//         this.http
//             .post(this.generateMarkingsURL, editor.innerHTML)
//             .pipe(finalize(() => this.loading$.next(false)))
//             .subscribe((next) => {
//                 this.processedText = next as ProcessedText;
//                 this.processedText.textMarkings = sortParagraphedTextMarkings(
//                     this.processedText.textMarkings
//                 );
//                 const consumableTextMarkings: TextMarking[] = Array.from(
//                     this.processedText.textMarkings
//                 );
//                 if (cursorPosition === CursorPosition.LAST_SAVE) {
//                     this.savedSelection = this.saveSelection(editor);
//                 }
//
//                 editor.childNodes.forEach(
//                     (childNode: ChildNode, index: number) => {
//                         const p: HTMLParagraphElement =
//                             document.createElement('p');
//                         p.innerHTML = childNode.textContent!;
//                         if (childNode.textContent === this.EMPTY_STRING) {
//                             p.innerHTML = this.LINE_BREAK;
//                         }
//                         editor.replaceChild(p, childNode);
//                         markText(
//                             p,
//                             consumableTextMarkings.filter(
//                                 (tm: TextMarking) => tm.paragraph === index
//                             )
//                         );
//                     }
//                 );
//
//                 this.positionCursor(editor, eventKey, cursorPosition);
//                 this.shouldCollapseSuggestions = new Array<boolean>(
//                     this.processedText.textMarkings.length
//                 ).fill(true);
//             });
//     }
//
//     /**
//      * Mark the editor after **EVENTUAL_MARKING_TIME** seconds. This is triggered in some scenarios including for
//      * when the user is typing a word and has paused but has not started writing a new word.
//      * @param {KeyboardEvent} $event fetched from the **onKeyboardEvent** method
//      * @private
//      */
//     private markEditorEventually($event: KeyboardEvent): void {
//         if (this.hasStoppedTypingForEventualMarking) {
//             this.makeRequestForEventualMarking$
//                 .pipe(
//                     switchMap(() => {
//                         return interval(this.EVENTUAL_MARKING_TIME);
//                     }),
//                     take(1)
//                 )
//                 .subscribe(() => {
//                     if (!this.cancelEventualMarking) {
//                         this.markEditor($event.key);
//                     } else {
//                         this.cancelEventualMarking = false;
//                     }
//                     this.hasStoppedTypingForEventualMarking = true;
//                 });
//         }
//
//         this.makeRequestForEventualMarking$.next();
//         this.hasStoppedTypingForEventualMarking = false;
//     }
//
//     /**
//      * Checks if the given emitted event key is included in a list of key triggers in order to mark the editor. For
//      * example breaking the current line is considered as a signal to attempt to mark the currently written text.
//      * Attempting to mark the editor after every keystroke can annoy the user and will also mean a significantly larger
//      * amount of requests made.
//      * @param {string} eventKey fetched from the **onKeyboardEvent** method
//      * @private
//      * @returns {boolean} true if the editor should be marked, false otherwise
//      */
//     // TODO there's also the paste to be considered
//     private shouldMarkEditor(eventKey: string): boolean {
//         const TRIGGERS = [
//             '.',
//             '!',
//             '?',
//             ',',
//             '…',
//             'Enter',
//             'Backspace',
//             'Delete',
//             ' ',
//             ':',
//             ';',
//             '"',
//             '“',
//             '”',
//             '&',
//             '(',
//             ')',
//             '/',
//             "'",
//             '«',
//             '»'
//         ];
//         return TRIGGERS.includes(eventKey);
//     }
//
//     /**
//      * Checks if the given emitted event key is included in a list of key non-triggers in order to not mark the editor.
//      * For example pressing one of the arrow keys in the keyboard should not alter the editor's markings.
//      * @param {string} eventKey fetched from the **onKeyboardEvent** method
//      * @private
//      * @returns {boolean} true if the editor should be not marked, false otherwise
//      */
//     private shouldNotMarkEditor(eventKey: string): boolean {
//         const NON_TRIGGERS = [
//             'Control',
//             'CapsLock',
//             'Shift',
//             'Alt',
//             'ArrowRight',
//             'ArrowUp',
//             'ArrowLeft',
//             'ArrowDown'
//         ];
//         return NON_TRIGGERS.includes(eventKey);
//     }
//
//     /**
//      * Position the cursor in the given element based on the provided position.
//      * @param {HTMLElement} element
//      * @param {string} eventKey
//      * @param {CursorPosition} cursorPosition
//      * @private
//      */
//     private positionCursor(
//         element: HTMLElement,
//         eventKey: string,
//         cursorPosition: CursorPosition
//     ): void {
//         if (cursorPosition === CursorPosition.LAST_SAVE) {
//             if (this.savedSelection) {
//                 const ALLOWED_KEY_CODES: string[] = ['Enter', 'Tab']; // TODO can't trigger Tab for now
//                 // if (!ALLOWED_KEY_CODES.includes(eventKey)) {
//                 this.restoreSelection(element, this.savedSelection);
//                 // }
//             }
//         } else if (cursorPosition === CursorPosition.END) {
//             this.positionCursorToEnd(element);
//         }
//     }
//
//     /**
//      * Places the cursor to the end of the given **elementNode**.
//      * @param {HTMLElement} elementNode
//      * @private
//      */
//     private positionCursorToEnd(elementNode: HTMLElement): void {
//         const range: Range = document.createRange();
//         const selection: Selection | null = window.getSelection();
//         range.selectNodeContents(elementNode);
//         range.collapse(false);
//         selection?.removeAllRanges();
//         selection?.addRange(range);
//         elementNode.focus();
//         range.detach();
//         elementNode.scrollTop = elementNode.scrollHeight;
//     }
//
//     /**
//      * Store the start and end position based on the **Range** of the current **Selection** at the given
//      * **elementNode**.
//      * @param {Node} elementNode the working node in which we want to generate the start and end position
//      */
//     private saveSelection(elementNode: Node): BasicAbstractRange {
//         const range: Range = window.getSelection()!.getRangeAt(0);
//         const preSelectionRange: Range = range.cloneRange();
//         preSelectionRange.selectNodeContents(elementNode);
//         preSelectionRange.setEnd(range.startContainer, range.startOffset);
//         const start: number = preSelectionRange.toString().length;
//
//         console.log(range.startContainer)
//         console.log(range.startOffset)
//         console.log(range.endContainer)
//         console.log(range.endOffset)
//         // console.log(elementNode)
//
//         this.someRange = range.cloneRange();
//         this.sC = range.cloneRange().startContainer;
//         this.eC = range.cloneRange().endContainer;
//         console.log('clone:', this.someRange)
//         return {
//             start: start,
//             end: start + range.toString().length
//         };
//     }
//
//     /**
//      * Restore the currently stored start and end position to a given **savedSelection** in **elementNode**.
//      * @param {Node} elementNode the working node in which we want to restore the start and end position
//      * @param {BasicAbstractRange} savedSelection the start and end numbers saved at an earlier point in time
//      */
//     private restoreSelection(
//         elementNode: Node,
//         savedSelection: BasicAbstractRange
//     ): void {
//         // console.log(elementNode)
//         let charIndex: number = 0;
//         const range: Range = document.createRange();
//         range.setStart(elementNode, 0);
//         range.collapse(true);
//         const nodeStack = [elementNode];
//         let node: Node | undefined,
//             foundStart: boolean = false,
//             stop: boolean = false;
//
//         debugger
//         console.log(this.savedSelection)
//         console.log(this.someRange)
//         console.log("sC", this.sC)
//         console.log("eC", this.eC)
//         while (!stop && (node = nodeStack.pop())) { // TODO shift?
//             console.log('right after `while`', node, this.sC.startContainer === node)
//             if (node.nodeType === Node.TEXT_NODE) {
//                 console.log('right after `TEXT_NODE`', node, node.textContent!.length)
//                 const nextCharIndex: number =
//                     charIndex + node.textContent!.length;
//                 if (
//                     !foundStart &&
//                     savedSelection.start >= charIndex &&
//                     savedSelection.start <= nextCharIndex
//                 ) {
//                     console.log('736', elementNode.childNodes[elementNode.childNodes.length-1])
//                     range.setStart(elementNode.childNodes[elementNode.childNodes.length-1], savedSelection.start - charIndex); //  + 1 ?
//                     foundStart = true;
//                 }
//                 if (
//                     foundStart &&
//                     savedSelection.end >= charIndex &&
//                     savedSelection.end <= nextCharIndex
//                 ) {
//                     range.setEnd(elementNode.childNodes[elementNode.childNodes.length-1], savedSelection.end - charIndex); //  + 1 ?
//                     stop = true;
//                 }
//                 charIndex = nextCharIndex;
//             } else {
//                 console.log('in the else clause', node)
//                 let i: number = node.childNodes.length;
//                 while (i--) {
//                     nodeStack.push(node.childNodes[i]);
//                 }
//             }
//         }
//
//         console.log("range.startContainer", range.startContainer)
//         const selection: Selection = window.getSelection()!;
//         selection.removeAllRanges();
//         selection.addRange(range);
//     }
//
//     private updateCharacterAndWordCount(): void {
//         this.updateCharacterCount();
//         this.updateWordCount();
//     }
//
//     /**
//      * Checks if the editor has text or not and shows the placeholder element when the editor is empty
//      */
//     updatePlaceholder(): void {
//         if (
//             !this.editorHasText() ||
//             this.editorElement.innerHTML === this.EMPTY_STRING
//         ) {
//             this.placeHolderElement.style.display = 'block';
//         } else {
//             this.placeHolderElement.style.display = 'none';
//         }
//     }
//
//     private handleRequestForStoringWrittenTexts(): void {
//         if (this.hasStoppedTypingForStoringWrittenTexts) {
//             this.makeRequestForStoringWrittenTexts$
//                 .pipe(
//                     switchMap(() => {
//                         return interval(15 * this.SECONDS);
//                     }),
//                     take(1)
//                 )
//                 .subscribe(() => {
//                     this.localStorageService.storeWrittenText(
//                         document.getElementById(this.EDITOR_KEY)!.innerText
//                     );
//                     this.hasStoppedTypingForStoringWrittenTexts = true;
//                 });
//         }
//
//         this.makeRequestForStoringWrittenTexts$.next();
//         this.hasStoppedTypingForStoringWrittenTexts = false;
//     }
// }
