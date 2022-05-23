import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {ProcessedText} from "./ProcessedText";
import {TextMarking} from "./Models/TextMarking";
import {environment} from "../environments/environment";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title: string = 'penda';
    EDITOR_KEY: string = 'editor';
    POPOVER_KEY: string = 'popover';
    writeTextToggleButtonID: string = 'writeTextToggleButton'
    uploadDocumentToggleButtonID: string = 'uploadDocumentToggleButton'
    baseURL!: string;
    generateMarkingsURL!: string;
    uploadDocumentURL!: string;
    pingURL!: string;
    processedText: ProcessedText | undefined;
    displayWriteTextOrUploadDocumentFlag: any = true;
    characterCount: number = 0;
    wordCount: number = 0;
    savedSelection: any;

    constructor(private http: HttpClient, private elementRef: ElementRef) {
        this.initializeURLs();
        // should any other call be made here? probably not... actually even this should be removed soon
        this.http.get(this.pingURL).subscribe(() => {
            console.log('pinging server...');
        });
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.generateMarkingsURL = this.baseURL + '/api/generateMarkings';
        this.uploadDocumentURL = this.baseURL + '/api/uploadDocument';
        this.pingURL = this.baseURL + '/api/ping';
    }

    // TODO this, along with the toggleUploadDocumentButton function surely can be improved
    toggleWriteTextButton() {
        const writeTextToggleButton = document.getElementById(this.writeTextToggleButtonID);
        const uploadDocumentToggleButton = document.getElementById(this.uploadDocumentToggleButtonID);

        if (!writeTextToggleButton?.classList.contains('active')) {
            uploadDocumentToggleButton?.classList.remove('active');
            uploadDocumentToggleButton?.classList.remove('btn-secondary');
            uploadDocumentToggleButton?.classList.add('btnUnselected')

            writeTextToggleButton?.classList.remove('btnUnselected');
            writeTextToggleButton?.classList.add('active');
            writeTextToggleButton?.classList.add('btn-secondary');

            this.displayWriteTextOrUploadDocumentFlag = true;
        }
    }

    // TODO this, along with the toggleWriteTextButton function surely can be improved
    toggleUploadDocumentButton() {
        const writeTextToggleButton = document.getElementById(this.writeTextToggleButtonID);
        const uploadDocumentToggleButton = document.getElementById(this.uploadDocumentToggleButtonID);

        if (!uploadDocumentToggleButton?.classList.contains('active')) {
            writeTextToggleButton?.classList.remove('active');
            writeTextToggleButton?.classList.remove('btn-secondary');
            writeTextToggleButton?.classList.add('btnUnselected')

            uploadDocumentToggleButton?.classList.remove('btnUnselected');
            uploadDocumentToggleButton?.classList.add('active');
            uploadDocumentToggleButton?.classList.add('btn-secondary');

            this.displayWriteTextOrUploadDocumentFlag = false;
        }
    }

    onTextChange() {
        this.updateCharacterCount();
        this.updateWordCount();
        if (this.stoppedTypingAWord()) {
            const editor = document.getElementById(this.EDITOR_KEY)!;
            this.http.post(this.generateMarkingsURL + "?limit=5", editor.innerText).subscribe(next => {
                this.processedText = next as ProcessedText;

                const writtenText = editor.innerText;
                if (this.processedText?.textMarkings.length != 0) {
                    let textWithHighlights: string = '';
                    let previousFromIndex: number = 0;
                    this.processedText?.textMarkings.forEach(tM => {
                        const markingType = tM.type;
                        textWithHighlights += writtenText.slice(previousFromIndex, tM.from) +
                            '<span class="spanToGenerateAPopover highlighted ' + markingType + '">' + writtenText.slice(tM.from, tM.to) + '</span>';
                        previousFromIndex = tM.to;
                    });
                    textWithHighlights += writtenText.slice(previousFromIndex, writtenText.length);
                    this.savedSelection = this.saveSelection(editor);
                    editor.innerHTML = textWithHighlights;
                    if (this.savedSelection) {
                        this.restoreSelection(editor, this.savedSelection);
                    }
                    this.listenForPopovers()
                }
            });
        }
    }

    onTextPaste($event: any) {
        $event.preventDefault()

        const text = ($event.originalEvent || $event).clipboardData.getData('text/plain');

        document.execCommand("insertHTML", false, text);
    }

    updateCharacterCount() {
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

    stoppedTypingAWord() {
        // TODO this list should probably be moved somewhere, and adapted accordingly
        const WORD_TERMINATING_CHARACTER_CODES = [10 /*\n*/, 33 /*!*/, 34 /*"*/, 38 /*&*/, 40 /*(*/, 41 /*)*/, 44 /*,*/,
            46 /*.*/, 47 /*/*/, 58 /*:*/, 59 /*;*/, 63 /*?*/, 92 /*\*/, 160 /* */, 171 /*«*/, 187/*»*/, 8220 /*“*/,
            8221 /*”*/, 8230 /*…*/];
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        const lastCharacterCode = editor.innerText.charCodeAt(editor.innerText.length - 1);
        const stoppedTyping: boolean = WORD_TERMINATING_CHARACTER_CODES.includes(lastCharacterCode);

        const deleted: boolean = false; // $event.key === 'Backspace' || $event.key === 'Delete';

        return stoppedTyping || deleted;
    }

    uploadDocument($event: any) {
        const fileList: FileList = $event.target.files;
        if (fileList.length === 1) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.http.post(this.uploadDocumentURL, formData).subscribe(next => {
                this.processedText = next as ProcessedText;
            });
        } else {
            alert("Ngarko vetëm një dokument!")
        }
    }

    chooseSuggestion(textMarkingIndex: number, suggestionIndex: number) {
        if (document.getElementById(this.POPOVER_KEY) != null) {
            document.getElementById(this.POPOVER_KEY)!.remove();
        }

        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        const writtenText = editor.innerText;
        const textMarking: TextMarking = this.processedText!.textMarkings[textMarkingIndex];

        const leftWrittenText = writtenText?.slice(0, textMarking.from);
        const rightWrittenText = writtenText?.slice(textMarking.to, writtenText.length);

        const modifiedWrittenText = leftWrittenText + textMarking.suggestions[suggestionIndex].action + rightWrittenText;

        this.http.post(this.generateMarkingsURL + "?limit=5", modifiedWrittenText).subscribe(next => {
            this.processedText = next as ProcessedText;

            if (this.processedText?.textMarkings.length != 0) {
                let textWithHighlights: string = '';
                let previousFromIndex: number = 0;
                this.processedText?.textMarkings.forEach(tM => {
                    const markingType = tM.type;
                    textWithHighlights += modifiedWrittenText.slice(previousFromIndex, tM.from) +
                        '<span class="spanToGenerateAPopover highlighted ' + markingType + '">' + modifiedWrittenText.slice(tM.from, tM.to) + '</span>';
                    previousFromIndex = tM.to;
                });
                textWithHighlights += modifiedWrittenText.slice(previousFromIndex, modifiedWrittenText.length);
                this.savedSelection = this.saveSelection(editor);
                editor.innerHTML = textWithHighlights;
                if (this.savedSelection) {
                    this.restoreSelection(editor, this.savedSelection);
                }
                this.listenForPopovers();
            }

            this.updateCharacterCount();
            this.updateWordCount();
        });
    }

    // TODO there might be a bug here that creates double spaces in the text, test more
    deleteTextMarking(index: number) {
        const editor = document.getElementById(this.EDITOR_KEY);
        const htmlElement: HTMLBodyElement = new DOMParser().parseFromString(editor!.innerHTML, "text/html")
            .firstChild!.lastChild! as HTMLBodyElement;

        htmlElement.replaceChild(document.createTextNode(htmlElement.children[index].textContent!), htmlElement.children[index]);

        editor!.innerHTML = htmlElement.innerHTML;

        this.processedText!.textMarkings = this.processedText!.textMarkings
            .filter(tM => tM != this.processedText!.textMarkings[index]);
    }

    saveSelection(elementNode: any) {
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

    listenForPopovers() {
        const textMarkings = this.elementRef.nativeElement.querySelectorAll(".spanToGenerateAPopover");
        if (textMarkings) {
            textMarkings.forEach((node: any, index: number) =>
                node.addEventListener('click', this.showPopover.bind(this, index)));
        }
    }

    showPopover(textMarkingIndex: number) {
        const editor: HTMLElement = document.getElementById(this.EDITOR_KEY)!;
        const htmlElement: HTMLBodyElement = new DOMParser().parseFromString(editor.innerHTML, "text/html")
            .firstChild!.lastChild! as HTMLBodyElement;

        const targetTextMarking = htmlElement.children[textMarkingIndex];

        const popover = document.createElement("div");
        popover.id = this.POPOVER_KEY;
        popover.classList.add("customPopover");

        const textMarkingRect = document.getElementsByClassName('spanToGenerateAPopover')[textMarkingIndex]
            .getBoundingClientRect();
        popover.style.left = textMarkingRect.left - 90 + 'px';
        if (window.matchMedia('(max-width: 800px)').matches) {
            popover.style.top = textMarkingRect.top - 100 + 'px';
        } else {
            popover.style.top = textMarkingRect.top - 102 + 'px';
        }

        const maxSuggestions = 3;
        const suggestions = this.processedText?.textMarkings[textMarkingIndex].suggestions!;
        popover.innerHTML = suggestions.map(sugg => '<span class="popoverSuggestion">' + sugg.display + '</span>')
            .slice(0, maxSuggestions).join("&nbsp<span class='tinyVerticalLine'>|</span>&nbsp");
        // .join("&nbsp<span class='vr tinyVerticalLine'></span>&nbsp");
        // TODO try button

        // TODO append or prepend?
        targetTextMarking.appendChild(popover);
        // targetTextMarking.insertBefore(document.createElement("div", ));

        editor.innerHTML = htmlElement.innerHTML;
        this.listenForMarkingSuggestionsSelection(textMarkingIndex);
        this.addListenerForRemovingPopovers()
    }

    addListenerForRemovingPopovers() {
        const that = this;
        document.onclick = function (e) {
            const htmlElement = e.target as HTMLElement;
            if (htmlElement.id !== that.POPOVER_KEY && !htmlElement.classList.contains('spanToGenerateAPopover')) {
                const popoverToRemove = document.getElementById(that.POPOVER_KEY);
                if (popoverToRemove != null) {
                    popoverToRemove.remove();
                    that.listenForPopovers();
                    document.onclick = null;
                }
            }
        };
    }

    listenForMarkingSuggestionsSelection(textMarkingIndex: number) {
        const popoverSuggestions = this.elementRef.nativeElement.querySelectorAll(".popoverSuggestion")
        if (popoverSuggestions) {
            popoverSuggestions.forEach((node: any, suggestionIndex: number) =>
                node.addEventListener('click', this.chooseSuggestion.bind(this, textMarkingIndex, suggestionIndex)));
        }
    }
}
