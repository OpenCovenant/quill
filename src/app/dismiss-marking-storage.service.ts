import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DismissMarkingStorageService {
    DISMISSED_MARKING_KEY = "penda-can-store-dissmised-markings";
    DISMISSED_MARKING_PREFIX = 'penda-dismissed-markings-';
    canStoreDismissedMarking: boolean = true;
    EMPTY_STRING: string = '';
    WRITTEN_TEXTS_KEYS: string[] = [];

    constructor() {
        const readyToStoreDismissedMarkings = localStorage.getItem(this.DISMISSED_MARKING_KEY);
        if (!readyToStoreDismissedMarkings) {
            if (this.canStoreDismissedMarking) {
                localStorage.setItem(this.DISMISSED_MARKING_KEY, 'true');
            }
        }
        if (readyToStoreDismissedMarkings === 'false') {
            this.canStoreDismissedMarking = false;
        }

        this.generateWrittenTextsKeys();
    }

    generateWrittenTextsKeys(): void {
        if (this.canStoreDismissedMarking) {
            const numberOfKeysToGenerate = 5;

            this.WRITTEN_TEXTS_KEYS = Array(numberOfKeysToGenerate)
                .fill(this.DISMISSED_MARKING_PREFIX)
                .map((prefix: string, i: number) => prefix + i.toString());
        }
    }

    storeDismissedText(dismissedText: string): void {
        if (dismissedText.trim() === this.EMPTY_STRING) {
            return;
        }

        const arr: string[] = [];
        for (let i = 0; i < this.WRITTEN_TEXTS_KEYS.length; i++) {
            arr.push(localStorage.getItem(this.WRITTEN_TEXTS_KEYS[i])!);
            if (!arr[arr.length - 1]) {
                for (let j = i; j >= 0; j--) {
                    if (j === 0) {
                        localStorage.setItem(
                            this.WRITTEN_TEXTS_KEYS[j],
                            dismissedText
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

        for (let i = this.WRITTEN_TEXTS_KEYS.length - 1; i >= 0; i--) {
            if (i === 0) {
                localStorage.setItem(this.WRITTEN_TEXTS_KEYS[i], dismissedText);
            } else {
                localStorage.setItem(this.WRITTEN_TEXTS_KEYS[i], arr[i - 1]);
            }
        }
    }
}

