import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    canStoreWrittenTexts: boolean = true;
    LOCAL_STORAGE_WRITTEN_TEXT_KEY: string = 'penda-can-store-written-texts';

    // save last n "writings" te local storage
    // a writing is defined as whenever you paste something, or click outside the editor
    // only save the innerText of the editor

    // the code in this service is simple (we might get performance issues if we stringify and parse an array/map), and
    // hardly extendable, consider refining in the future
    constructor() {
        const alreadyCanStoreWrittenTexts = localStorage.getItem(this.LOCAL_STORAGE_WRITTEN_TEXT_KEY);
        if (alreadyCanStoreWrittenTexts === undefined) {
            if (this.canStoreWrittenTexts) {
                localStorage.setItem(this.LOCAL_STORAGE_WRITTEN_TEXT_KEY, 'true');
            }
        }
        if (alreadyCanStoreWrittenTexts === 'false') {
            this.canStoreWrittenTexts = false;
        }
    }

    fetchWrittenTextsHistory(): Array<string> {
        // localStorage.setItem('penda-written-text-0', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nibh venenatis cras sed felis.');
        // localStorage.setItem('penda-written-text-1', 'Ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae. Egestas congue quisque egestas diam in. Enim nulla aliquet porttitor lacus luctus.');
        // localStorage.setItem('penda-written-text-2', 'Ut sem viverra aliquet eget sit amet. At lectus urna duis convallis convallis tellus id interdum. Neque ornare aenean euismod elementum nisi quis eleifend.');
        // localStorage.setItem('penda-written-text-3', 'Sit amet consectetur adipiscing elit ut aliquam purus. Nunc lobortis mattis aliquam faucibus purus in massa. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi.');
        // localStorage.setItem('penda-written-text-4', 'Aliquam etiam erat velit scelerisque in. Nibh venenatis cras sed felis eget velit aliquet sagittis. At augue eget arcu dictum. Erat nam at lectus urna duis convallis convallis tellus id. Congue eu consequat ac felis donec.');
        if (!this.canStoreWrittenTexts) {
            localStorage.removeItem('penda-written-text-0');
            localStorage.removeItem('penda-written-text-1');
            localStorage.removeItem('penda-written-text-2');
            localStorage.removeItem('penda-written-text-3');
            localStorage.removeItem('penda-written-text-4');
        }

        const writtenTextsHistory: Array<string> = [];
        const writtenText0 = localStorage.getItem('penda-written-text-0');
        if (writtenText0 === undefined) {
            return writtenTextsHistory;
        }
        writtenTextsHistory.push(writtenText0!);

        const writtenText1 = localStorage.getItem('penda-written-text-1');
        if (writtenText1 === undefined) {
            return writtenTextsHistory;
        }
        writtenTextsHistory.push(writtenText1!);

        const writtenText2 = localStorage.getItem('penda-written-text-2');
        if (writtenText2 === undefined) {
            return writtenTextsHistory;
        }
        writtenTextsHistory.push(writtenText2!);

        const writtenText3 = localStorage.getItem('penda-written-text-3');
        if (writtenText3 === undefined) {
            return writtenTextsHistory;
        }
        writtenTextsHistory.push(writtenText3!);

        const writtenText4 = localStorage.getItem('penda-written-text-4');
        if (writtenText4 === undefined) {
            return writtenTextsHistory;
        }
        writtenTextsHistory.push(writtenText4!);

        return writtenTextsHistory;
    }

    addNewWrittenText(newWrittenText: string) {
        const writtenText0 = localStorage.getItem('penda-written-text-0');
        if (!writtenText0) {
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText1 = localStorage.getItem('penda-written-text-1');
        if (!writtenText1) {
            localStorage.setItem('penda-written-text-1', writtenText0!);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText2 = localStorage.getItem('penda-written-text-2');
        if (!writtenText2) {
            localStorage.setItem('penda-written-text-2', writtenText1!);
            localStorage.setItem('penda-written-text-1', writtenText0!);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText3 = localStorage.getItem('penda-written-text-3');
        if (!writtenText3) {
            localStorage.setItem('penda-written-text-3', writtenText2!);
            localStorage.setItem('penda-written-text-2', writtenText1!);
            localStorage.setItem('penda-written-text-1', writtenText0!);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText4 = localStorage.getItem('penda-written-text-4');
        if (!writtenText4) {
            localStorage.setItem('penda-written-text-4', writtenText3!);
            localStorage.setItem('penda-written-text-4', writtenText2!);
            localStorage.setItem('penda-written-text-2', writtenText1!);
            localStorage.setItem('penda-written-text-1', writtenText0!);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        localStorage.setItem('penda-written-text-4', writtenText3);
        localStorage.setItem('penda-written-text-3', writtenText2);
        localStorage.setItem('penda-written-text-2', writtenText1);
        localStorage.setItem('penda-written-text-1', writtenText0);
        localStorage.setItem('penda-written-text-0', newWrittenText);
    }
}
