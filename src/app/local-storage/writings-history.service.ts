import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WritingsHistoryService {
    // TODO: this is duplicated in home.component.ts
    EMPTY_STRING: string = '';
    LOCAL_STORAGE_WRITINGS_KEY: string = 'penda-can-store-writings';
    WRITINGS_HISTORY_LENGTH = 5;
    WRITINGS_HISTORY_PREFIX = 'penda-writings-history-';
    WRITINGS_HISTORY_KEYS: string[] = Array(this.WRITINGS_HISTORY_LENGTH)
        .fill(this.WRITINGS_HISTORY_PREFIX)
        .map((s: string, i: number) => s + i.toString());
    canStoreWritings: boolean = true;

    // save last n "writings" te local storage
    // a writing is defined as whenever you paste something, or click outside the editor
    // only save the innerText of the editor

    // the code in this service is simple (we might get performance issues if we stringify and parse an array/map), and
    // hardly extendable, consider refining in the future
    constructor() {
        const alreadyCanStoreWritings: string | null = localStorage.getItem(
            this.LOCAL_STORAGE_WRITINGS_KEY
        );
        if (!alreadyCanStoreWritings) {
            if (this.canStoreWritings) {
                localStorage.setItem(this.LOCAL_STORAGE_WRITINGS_KEY, 'true');
            }
        }
        if (alreadyCanStoreWritings === 'false') {
            this.canStoreWritings = false;
        }
    }

    toggleWritingPermission(checked: boolean): void {
        if (!checked) {
            this.clearWritingsHistory();
        }
        this.canStoreWritings = checked;
        localStorage.setItem(
            this.LOCAL_STORAGE_WRITINGS_KEY,
            checked.toString()
        );
    }

    fetchWritingsHistory(): Array<string> {
        const writingsHistory: Array<string> = [];
        if (!this.canStoreWritings) {
            this.clearWritingsHistory();
            return writingsHistory;
        }

        for (let i = 0; i < this.WRITINGS_HISTORY_KEYS.length; i++) {
            const writingIndex: string | null = localStorage.getItem(
                this.WRITINGS_HISTORY_KEYS[i]
            );
            if (!writingIndex) {
                return writingsHistory;
            }
            writingsHistory.push(writingIndex);
        }

        return writingsHistory;
    }

    /**
     * Stores the given text in the Local Storage.
     * @param writing
     */
    storeWriting(writing: string): void {
        if (writing.trim() === this.EMPTY_STRING) {
            return;
        }

        const arr: string[] = [];
        for (let i = 0; i < this.WRITINGS_HISTORY_LENGTH; i++) {
            arr.push(localStorage.getItem(this.WRITINGS_HISTORY_KEYS[i])!);
            if (!arr[arr.length - 1]) {
                for (let j = i; j >= 0; j--) {
                    if (j === 0) {
                        localStorage.setItem(
                            this.WRITINGS_HISTORY_KEYS[j],
                            writing
                        );
                    } else {
                        localStorage.setItem(
                            this.WRITINGS_HISTORY_KEYS[j],
                            arr[j - 1]
                        );
                    }
                }
                return;
            }
        }

        for (let i = this.WRITINGS_HISTORY_LENGTH - 1; i >= 0; i--) {
            if (i === 0) {
                localStorage.setItem(this.WRITINGS_HISTORY_KEYS[i], writing);
            } else {
                localStorage.setItem(this.WRITINGS_HISTORY_KEYS[i], arr[i - 1]);
            }
        }
    }

    private clearWritingsHistory(): void {
        for (
            let index = 0;
            index < this.WRITINGS_HISTORY_KEYS.length;
            index++
        ) {
            localStorage.removeItem(this.WRITINGS_HISTORY_KEYS[index]);
        }
    }
}
