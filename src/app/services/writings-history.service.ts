import { Injectable } from '@angular/core';
import { EMPTY_STRING } from './constants';

@Injectable({
    providedIn: 'root'
})
export class WritingsHistoryService {
    CAN_STORE_WRITINGS_KEY: string = 'penda-can-store-writings';
    WRITINGS_HISTORY_KEY: string = 'penda-writings-history';
    canStoreWritings: boolean = false;

    constructor() {
        const alreadyCanStoreWritings: string | null = localStorage.getItem(
            this.CAN_STORE_WRITINGS_KEY
        );
        if (!alreadyCanStoreWritings) {
            if (this.canStoreWritings) {
                localStorage.setItem(this.CAN_STORE_WRITINGS_KEY, 'true');
            }
        }
        if (alreadyCanStoreWritings === 'false') {
            this.canStoreWritings = false;
        } else if (alreadyCanStoreWritings === 'true') {
            this.canStoreWritings = true;
        }
    }

    toggleWritingPermission(checked: boolean): void {
        if (!checked) {
            this.clearWritingsHistory();
        }
        this.canStoreWritings = checked;
        localStorage.setItem(this.CAN_STORE_WRITINGS_KEY, checked.toString());
    }

    fetchWritingsHistory(): Array<string> {
        const writingsHistory: Array<string> = [];
        if (!this.canStoreWritings) {
            this.clearWritingsHistory();
            return writingsHistory;
        }

        return JSON.parse(localStorage.getItem(this.WRITINGS_HISTORY_KEY)!);
    }

    /**
     * Stores the given text in the Local Storage.
     * @param {string} writing
     */
    storeWriting(writing: string): void {
        if (writing.trim() === EMPTY_STRING) {
            return;
        }
        let writingsHistoryOptional: string | null = localStorage.getItem(
            this.WRITINGS_HISTORY_KEY
        );
        if (!writingsHistoryOptional) {
            writingsHistoryOptional = JSON.stringify([]);
        }
        const writingsHistory: string[] = JSON.parse(writingsHistoryOptional);
        writingsHistory.push(writing);
        localStorage.setItem(
            this.WRITINGS_HISTORY_KEY,
            JSON.stringify(writingsHistory)
        );
    }

    private clearWritingsHistory(): void {
        localStorage.removeItem(this.WRITINGS_HISTORY_KEY);
    }
}
