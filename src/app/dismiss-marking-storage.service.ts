import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DismissMarkingStorageService {
    DISMISSED_MARKING_KEY = "penda-can-store-dissmised-markings";
    DISMISSED_MARKING_PREFIX = 'penda-dismissed-markings-';
    canStoreDismissedMarking: boolean = true;
    EMPTY_STRING: string = '';
    DISMISSED_TEXTS_KEYS: string[] = [];

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
    }

    storeDismissedText(dismissedText: string): void {
        if (dismissedText.trim() === this.EMPTY_STRING) {
            return;
        }

        let index = 0;
        let key = this.DISMISSED_MARKING_PREFIX + index.toString();

        while (JSON.parse(localStorage.getItem(key)!)) {
            index++;
            key = this.DISMISSED_MARKING_PREFIX + index.toString();
        }

        localStorage.setItem(key, dismissedText);
        this.DISMISSED_TEXTS_KEYS.push(key);
    }
}
