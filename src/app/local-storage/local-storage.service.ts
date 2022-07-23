import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    LOCAL_STORAGE_WRITTEN_TEXT_KEY: string = 'penda-can-store-written-texts';
    WRITTEN_TEXTS_KEYS: string[] = ['penda-written-text-0', 'penda-written-text-1', 'penda-written-text-2',
        'penda-written-text-3', 'penda-written-text-4']; // TODO consider .repeat()
    canStoreWrittenTexts: boolean = true;

    // save last n "writings" te local storage
    // a writing is defined as whenever you paste something, or click outside the editor
    // only save the innerText of the editor

    // the code in this service is simple (we might get performance issues if we stringify and parse an array/map), and
    // hardly extendable, consider refining in the future
    constructor() {
        const alreadyCanStoreWrittenTexts = localStorage.getItem(this.LOCAL_STORAGE_WRITTEN_TEXT_KEY);
        if (!alreadyCanStoreWrittenTexts) {
            if (this.canStoreWrittenTexts) {
                localStorage.setItem(this.LOCAL_STORAGE_WRITTEN_TEXT_KEY, 'true');
            }
        }
        if (alreadyCanStoreWrittenTexts === 'false') {
            this.canStoreWrittenTexts = false;
        }
    }

    toggleWritingPermission(checked: boolean): void {
        if (!checked) {
            this._clearWrittenTexts();
        }
        this.canStoreWrittenTexts = checked;
        localStorage.setItem(this.LOCAL_STORAGE_WRITTEN_TEXT_KEY, checked.toString());
    }

    fetchWrittenTextsHistory(): Array<string> {
        const writtenTextsHistory: Array<string> = [];
        if (!this.canStoreWrittenTexts) {
            this._clearWrittenTexts();
            return writtenTextsHistory;
        }

        for (let i = 0; i < this.WRITTEN_TEXTS_KEYS.length; i++) {
            const writtenTextIndex = localStorage.getItem(this.WRITTEN_TEXTS_KEYS[i]);
            if (!writtenTextIndex) {
                return writtenTextsHistory;
            }
            writtenTextsHistory.push(writtenTextIndex);
        }

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
            localStorage.setItem('penda-written-text-1', writtenText0);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText2 = localStorage.getItem('penda-written-text-2');
        if (!writtenText2) {
            localStorage.setItem('penda-written-text-2', writtenText1);
            localStorage.setItem('penda-written-text-1', writtenText0);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText3 = localStorage.getItem('penda-written-text-3');
        if (!writtenText3) {
            localStorage.setItem('penda-written-text-3', writtenText2);
            localStorage.setItem('penda-written-text-2', writtenText1);
            localStorage.setItem('penda-written-text-1', writtenText0);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        const writtenText4 = localStorage.getItem('penda-written-text-4');
        if (!writtenText4) {
            localStorage.setItem('penda-written-text-4', writtenText3);
            localStorage.setItem('penda-written-text-4', writtenText2);
            localStorage.setItem('penda-written-text-2', writtenText1);
            localStorage.setItem('penda-written-text-1', writtenText0);
            localStorage.setItem('penda-written-text-0', newWrittenText);
            return;
        }

        localStorage.setItem('penda-written-text-4', writtenText3);
        localStorage.setItem('penda-written-text-3', writtenText2);
        localStorage.setItem('penda-written-text-2', writtenText1);
        localStorage.setItem('penda-written-text-1', writtenText0);
        localStorage.setItem('penda-written-text-0', newWrittenText);
    }

    _clearWrittenTexts() {
        for (let index = 0; index < this.WRITTEN_TEXTS_KEYS.length; index++) {
            localStorage.removeItem(this.WRITTEN_TEXTS_KEYS[index]);
        }
    }
}
