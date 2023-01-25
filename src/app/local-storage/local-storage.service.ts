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
