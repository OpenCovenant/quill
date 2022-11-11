import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Subject, interval, finalize, switchMap, take} from "rxjs";

import {CursorPosition} from "../models/cursor-positioning";
import {LocalStorageService} from "../local-storage/local-storage.service";
import {ProcessedText} from "../models/processed-text";
import {TextMarking} from "../models/text-marking";
import {environment} from "../../environments/environment";
import {markText, sortParagraphedTextMarkings} from "../text-marking/text-marking";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
    SECONDS: number = 1000;
    EMPTY_STRING: string = "";
    EDITOR_KEY: string = 'editor';
    PLACEHOLDER_ELEMENT_ID: string = 'editor-placeholder';
    LINE_BREAK = '<br>';
    LINE_BROKEN_PARAGRAPH: string = '<p>' + this.LINE_BREAK + '</p>';
    EDITOR_PLACEHOLDER_TEXT: string = 'Shkruaj këtu ose ngarko një dokument.';
    writeTextToggleButtonID: string = 'writeTextToggleButton'
    uploadDocumentToggleButtonID: string = 'uploadDocumentToggleButton'
    processedText: ProcessedText | undefined;
    displayWriteTextOrUploadDocumentFlag: any = true;
    characterCount: number = 0;
    wordCount: number = 0;
    innerHTMLOfEditor: string = this.LINE_BROKEN_PARAGRAPH;
    shouldCollapseSuggestions: Array<boolean> = []; // TODO improve
    loading$ = new BehaviorSubject<boolean>(false);

    private placeHolderElement!: HTMLElement ;
    private editorElement!: HTMLElement;
    private baseURL!: string;
    private generateMarkingsURL!: string;
    private uploadDocumentURL!: string;
    private pingURL!: string;
    private hasStoppedTypingForStoringWrittenTexts: boolean = true; // stopped typing after some seconds
    private hasStoppedTypingForEventualMarking: boolean = true; // stopped typing after some seconds
    private makeRequestForStoringWrittenTexts$ = new Subject<void>();
    private makeRequestForEventualMarking$ = new Subject<void>();
    private cancelEventualMarking: boolean = false;
    private savedSelection: any;

    constructor(public localStorageService: LocalStorageService, private http: HttpClient) {
        this.initializeURLs();
        // should any other call be made here? probably not... actually even this should be removed soon
        this.http.get(this.pingURL).subscribe(() => {
            console.log('pinging server...');
        });
    }

    ngAfterViewInit(): void {
        // save reference and reuse variable instead of reinitializing multiple times
        this.editorElement = document.getElementById(this.EDITOR_KEY)!;
        this.placeHolderElement = document.getElementById(this.PLACEHOLDER_ELEMENT_ID)!;
        const minWidthMatchMedia: MediaQueryList = window.matchMedia("(min-width: 800px)");
        this.focusOnMediaMatch(minWidthMatchMedia);
        // TODO some browsers still seem to use this deprecated method, keep it around for some more time
        minWidthMatchMedia.addListener(this.focusOnMediaMatch);
        (document.getElementById("flexSwitchCheckChecked") as any).checked = this.localStorageService.canStoreWrittenTexts;
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.generateMarkingsURL = this.baseURL + '/api/generateMarkingsForParagraphs';
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
        this.pingURL = this.baseURL + '/api/ping';
    }

    // TODO this, along with the toggleUploadDocumentButton function surely can be improved
    toggleWriteTextButton() {
        const writeTextToggleButton = document.getElementById(this.writeTextToggleButtonID);
        const uploadDocumentToggleButton = document.getElementById(this.uploadDocumentToggleButtonID);

        if (!writeTextToggleButton?.classList.contains('active')) {
            uploadDocumentToggleButton?.classList.remove('active', 'btn-secondary');
            uploadDocumentToggleButton?.classList.add('btnUnselected')

            writeTextToggleButton?.classList.remove('btnUnselected');
            writeTextToggleButton?.classList.add('active', 'btn-secondary');

            if (this.innerHTMLOfEditor === this.LINE_BROKEN_PARAGRAPH) { // in the scenario that a file has been uploaded
                this.processedText = undefined;
            }

            this.displayWriteTextOrUploadDocumentFlag = true;
        }
    }

    // TODO this, along with the toggleWriteTextButton function surely can be improved
    toggleUploadDocumentButton() {
        const writeTextToggleButton = document.getElementById(this.writeTextToggleButtonID);
        const uploadDocumentToggleButton = document.getElementById(this.uploadDocumentToggleButtonID);

        if (!uploadDocumentToggleButton?.classList.contains('active')) {
            this.innerHTMLOfEditor = document.getElementById(this.EDITOR_KEY)!.innerHTML;

            writeTextToggleButton?.classList.remove('active', 'btn-secondary');
            writeTextToggleButton?.classList.add('btnUnselected')

            uploadDocumentToggleButton?.classList.remove('btnUnselected');
            uploadDocumentToggleButton?.classList.add('active', 'btn-secondary');

            this.displayWriteTextOrUploadDocumentFlag = false;
        }
    }

    onKeyboardEvent($event: KeyboardEvent) {
        if (this.shouldNotUpdateEditor($event.key)) {
            return;
        }
        this.updatePlaceholder();
        
        this.updateCharacterAndWordCount();
        if (this.shouldMarkEditor($event.key)) {
            this.markEditor($event.key);
            this.cancelEventualMarking = true;
        } else {
            this.cancelEventualMarking = false;
            this.markEditorEventually($event);
        }
        this.handleRequestForStoringWrittenTexts();
    }

    /**
     * Checks if the editor has text or not and shows the placeholder element when the editor is empty
     */
    updatePlaceholder(): void {
        if (!this.editorHasText() || this.editorElement.innerHTML === ''){
            this.placeHolderElement!.style.display = 'block';
        } else {
            this.placeHolderElement!.style.display = 'none';
        }
    }

    // TODO data-placeholder broke
    onTextPaste($event: ClipboardEvent) {
        $event.preventDefault()
        if (!$event.clipboardData) { 
            return;
        }
        const text: string = $event.clipboardData.getData('text/plain');

        document.execCommand("insertText", false, text);

        this.localStorageService.storeWrittenText(text);

        // DELETE: after strongly typing you can see the issue identified
        // positioning cursor based on event.key makes no sense here as for this onPaste event there is no key related to it
        this.markEditor('', CursorPosition.END);
        this.updateCharacterAndWordCount();
    }

    updateCharacterCount() {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        // for the scenario of the default text being <p><br></p> and this method being triggered by shift, ctrl, ...
        if (editor.innerText.length === 1 && editor.innerText.charCodeAt(0) === 10) {
            return;
        }
        this.characterCount = document.getElementById(this.EDITOR_KEY)!.innerText.length;
    }

    updateWordCount() {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        if (editor.innerText === '') {
            this.wordCount = 0;
        } else {
            const wordMatches = editor.innerText.match(/\b(\w+)\b/g)!;
            if (wordMatches) {
                this.wordCount = wordMatches.length;
            } else {
                this.wordCount = 0;
            }
        }
    }

    uploadDocument($event: Event) {
        const fileList: FileList | null = ($event.target as HTMLInputElement).files;
        if (fileList && fileList.length === 1) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.http.post(this.uploadDocumentURL, formData).subscribe(next => {
                this.processedText = next as ProcessedText;
                this.shouldCollapseSuggestions = new Array<boolean>(this.processedText.textMarkings.length).fill(true);
                this.innerHTMLOfEditor = this.LINE_BROKEN_PARAGRAPH; // TODO careful with the <br> here
            });
        } else {
            alert("Ngarko vetëm një dokument!")
        }
    }

    chooseSuggestion(textMarkingIndex: number, suggestionIndex: number): void {
        // don't choose suggestions on an uploaded file
        if (!this.displayWriteTextOrUploadDocumentFlag) {
            return;
        }

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;

        const textMarking: TextMarking = this.processedText!.textMarkings[textMarkingIndex];
        const childNode: ChildNode = editor.childNodes[textMarking.paragraph!];
        const p = document.createElement('p');

        const writtenText = childNode.textContent!;
        const leftWrittenText = writtenText.slice(0, textMarking.from);
        const rightWrittenText = writtenText.slice(textMarking.to, writtenText.length);

        p.innerHTML = leftWrittenText + textMarking.suggestions[suggestionIndex].action + rightWrittenText;
        if (childNode.textContent === this.EMPTY_STRING) {
            p.innerHTML = this.LINE_BREAK
        }
        editor.replaceChild(p, childNode); // TODO keep in mind that this nullifies other markings in this p as well

        this.http.post(this.generateMarkingsURL, editor.innerHTML).subscribe(next => {
            this.processedText = next as ProcessedText;

            if (this.processedText?.textMarkings.length != 0) {
                this.processedText.textMarkings = sortParagraphedTextMarkings(this.processedText.textMarkings);
                const depletableTextMarkings: TextMarking[] = Array.from(this.processedText.textMarkings);

                editor.childNodes.forEach((childNode: ChildNode, index: number) => {
                    const p = document.createElement('p');
                    p.innerHTML = childNode.textContent!;
                    if (childNode.textContent === this.EMPTY_STRING) {
                        p.innerHTML = this.LINE_BREAK
                    }
                    editor.replaceChild(p, childNode);
                    markText(p, depletableTextMarkings.filter((tm: TextMarking) => tm.paragraph === index));
                });

                // TODO editor or childNode here? I guess we have to do the whole thing always...
                // markText(editor, depletableTextMarkings.filter((tm: TextMarking) => tm.paragraph === textMarking.paragraph!));
            }
            this.setCursorToEnd(editor);

            this.updateCharacterAndWordCount();
            this.shouldCollapseSuggestions = new Array<boolean>(this.processedText.textMarkings.length).fill(true);
        });
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    deleteTextMarking(index: number): void {
        if (this.displayWriteTextOrUploadDocumentFlag) {
            const editor = document.getElementById(this.EDITOR_KEY);
            const htmlElement: HTMLBodyElement = new DOMParser().parseFromString(editor!.innerHTML, "text/html")
                .firstChild!.lastChild! as HTMLBodyElement;

            htmlElement.replaceChild(document.createTextNode(htmlElement.children[index].textContent!), htmlElement.children[index]);

            editor!.innerHTML = htmlElement.innerHTML;
        }

        this.processedText!.textMarkings = this.processedText!.textMarkings
            .filter(tM => tM != this.processedText!.textMarkings[index]);
        this.shouldCollapseSuggestions = new Array<boolean>(this.processedText!.textMarkings.length).fill(true);
    }

    saveSelection(elementNode: Node) {
        const range = window.getSelection()!.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(elementNode);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    };

    restoreSelection(elementNode: any, savedSelection: any) {
        let charIndex = 0, range = document.createRange();
        range.setStart(elementNode, 0);
        range.collapse(true);
        let nodeStack = [elementNode], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                const nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSelection.start >= charIndex && savedSelection.start <= nextCharIndex) {
                    range.setStart(node, savedSelection.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSelection.end >= charIndex && savedSelection.end <= nextCharIndex) {
                    range.setEnd(node, savedSelection.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        const selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
    }

    editorHasText(): boolean {
        return document.getElementById(this.EDITOR_KEY)!.innerHTML !== this.LINE_BROKEN_PARAGRAPH;
    }

    clearEditor(): void {
        document.getElementById(this.EDITOR_KEY)!.innerHTML = this.LINE_BROKEN_PARAGRAPH;
        this.updatePlaceholder();
        this.processedText = undefined;
        this.updateCharacterAndWordCount();
        this.shouldCollapseSuggestions = new Array<boolean>(0);
    }

    oscillateSuggestion(textMarkingIndex: number, $event: Event) {
        const oscillatingButtonClasses: DOMTokenList = ($event.target as HTMLHeadingElement).classList;
        if (oscillatingButtonClasses.contains('bi-arrow-right-square')) {
            if (this.shouldCollapseSuggestions[textMarkingIndex]) {
                this.shouldCollapseSuggestions[textMarkingIndex] = false;
            }
        } else if (oscillatingButtonClasses.contains('bi-arrow-left-square')) {
            if (!this.shouldCollapseSuggestions[textMarkingIndex]) {
                this.shouldCollapseSuggestions[textMarkingIndex] = true;
            }
        } else {
            throw new Error("The oscillating button should have one of these classes given that you could see it to click it!");
        }
    }

    copyToClipboard() {
        const copyToClipboardButton = document.getElementById("copyToClipboardButton")!;
        copyToClipboardButton.classList.replace("bi-clipboard", "bi-clipboard2-check");
        copyToClipboardButton.style.color = "green";

        const editor = document.getElementById(this.EDITOR_KEY)!;
        let range, select;
        if (document.createRange) {
            range = document.createRange();
            range.selectNodeContents(editor)
            select = window.getSelection()!;
            select.removeAllRanges();
            select.addRange(range);
            document.execCommand('copy');
            select.removeAllRanges();
        } else {
            range = (document.body as any).createTextRange();
            range.moveToElementText(editor);
            range.select();
            document.execCommand('copy');
        }

        setTimeout(function () {
            copyToClipboardButton.classList.replace("bi-clipboard2-check", "bi-clipboard");
            copyToClipboardButton.style.color = "black";
        }, 2 * this.SECONDS);
    }

    toggleStoringOfWrittenTexts() {
        this.localStorageService.toggleWritingPermission((document.getElementById("flexSwitchCheckChecked") as any).checked)
    }

    focusOnMediaMatch(mediaMatch: any) {
        if (mediaMatch.matches) {
            document.getElementById(this.EDITOR_KEY)?.focus();
        }
    }

    placeWrittenText(writtenText: string): void {
        document.getElementById(this.EDITOR_KEY)!.innerText = writtenText;
        document.getElementById("closeWrittenTextsModalButton")!.click();
        this.markEditor();
        this.updateCharacterAndWordCount();
    }


    getTextOfTextMarking(i: number): string {
        const editor: HTMLElement | null = document.getElementById(this.EDITOR_KEY)!;
        if (!editor) { return ''; }

        const textMarking: TextMarking | null = this.processedText ? this.processedText.textMarkings[i]: null;
        if (!textMarking ) { return ''; }
        if (!textMarking.paragraph) { return ''; }        

        const editorTextContent: string | null = editor.childNodes[textMarking.paragraph].textContent;
        if (!editorTextContent) { return '' }
        
        return editorTextContent.slice(textMarking.from, textMarking.to);
    }

    private markEditor(eventKey: string = '', cursorPosition: CursorPosition = CursorPosition.LAST_SAVE): void {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;

        this.loading$.next(true);
        this.http.post(this.generateMarkingsURL, editor.innerHTML)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(next => {
                this.processedText = next as ProcessedText;
                this.processedText.textMarkings = sortParagraphedTextMarkings(this.processedText.textMarkings);
                const depletableTextMarkings: TextMarking[] = Array.from(this.processedText.textMarkings);
                if (cursorPosition === CursorPosition.LAST_SAVE) {
                    this.savedSelection = this.saveSelection(editor);
                }

                editor.childNodes.forEach((childNode: ChildNode, index: number) => {
                    const p: HTMLParagraphElement = document.createElement('p');
                    p.innerHTML = childNode.textContent!;
                    if (childNode.textContent === this.EMPTY_STRING) {
                        p.innerHTML = this.LINE_BREAK
                    }
                    editor.replaceChild(p, childNode);
                    markText(p, depletableTextMarkings.filter((tm: TextMarking) => tm.paragraph === index));
                });

                this.positionCursor(editor, eventKey, cursorPosition);
                this.shouldCollapseSuggestions = new Array<boolean>(this.processedText.textMarkings.length).fill(true);
            });
    }

    private markEditorEventually($event: KeyboardEvent) {
        if (this.hasStoppedTypingForEventualMarking) {
            this.makeRequestForEventualMarking$.pipe(
                switchMap(() => {
                    return interval(2 * this.SECONDS);
                }), take(1)
            ).subscribe(() => {
                if (!this.cancelEventualMarking) {
                    this.markEditor($event.key);
                    this.hasStoppedTypingForEventualMarking = true;
                } else {
                    this.cancelEventualMarking = false;
                    this.hasStoppedTypingForEventualMarking = true;
                }
            });
        }

        this.makeRequestForEventualMarking$.next();
        this.hasStoppedTypingForEventualMarking = false;
    }


    // TODO there's also the paste to be considered
    private shouldMarkEditor(eventKey: string) {
        /**
         * Considers the lastly (time-wise) typed character.
         */
        const TRIGGERS = ['.', '!', '?', ',', '…', 'Enter', 'Backspace', 'Delete', ' ', ':', ';', '"', '“', '”', '&',
            '(', ')', '/', '\'', '«', '»'];
        return TRIGGERS.includes(eventKey);
    }

    private shouldNotUpdateEditor(eventKey: string) {
        /**
         * Considers the lastly (time-wise) typed character.
         */
        const NON_TRIGGERS = ['Control', 'CapsLock', 'Shift', 'Alt', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'];
        return NON_TRIGGERS.includes(eventKey);
    }

    private positionCursor(element: HTMLElement, eventKey: string, cursorPosition: CursorPosition) {
        if (cursorPosition === CursorPosition.LAST_SAVE) {
            if (this.savedSelection) {
                const ALLOWED_KEY_CODES: string[] = ['Enter', 'Tab'];  // TODO can't trigger Tab for now
                if (!ALLOWED_KEY_CODES.includes(eventKey)) {
                    this.restoreSelection(element, this.savedSelection);
                }
            }
        } else if (cursorPosition === CursorPosition.END) {
            this.setCursorToEnd(element);
        }
    }

    private setCursorToEnd(target: HTMLElement) {
        const range: Range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(target);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        target.focus();
        range.detach();
        target.scrollTop = target.scrollHeight;
    }

    private updateCharacterAndWordCount(): void {
        this.updateCharacterCount();
        this.updateWordCount();
    }

    private handleRequestForStoringWrittenTexts() {
        if (this.hasStoppedTypingForStoringWrittenTexts) {
            this.makeRequestForStoringWrittenTexts$.pipe(
                switchMap(() => {
                    return interval(15 * this.SECONDS);
                }), take(1)
            ).subscribe(() => {
                this.localStorageService.storeWrittenText(document.getElementById(this.EDITOR_KEY)!.innerText);
                this.hasStoppedTypingForStoringWrittenTexts = true;
            });
        }

        this.makeRequestForStoringWrittenTexts$.next();
        this.hasStoppedTypingForStoringWrittenTexts = false;
    }
}
