import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DismissMarkingStorageService {
    DISMISSED_MARKING_PREFIX = 'penda-dismissed-markings-';
    canStoreDismissedMarking: boolean = true;
    EMPTY_STRING: string = '';
    DISMISSED_TEXTS_KEYS: string[] = [];


    constructor() {}

    storeDismissedText(dismissedText: string): void {
        if (!this.canStoreDismissedMarking || dismissedText.trim() === this.EMPTY_STRING) {
            return;
        }

        let index = 0;
        let key = this.DISMISSED_MARKING_PREFIX + index.toString();

        while (localStorage.getItem(key)) {
            index++;
            key = this.DISMISSED_MARKING_PREFIX + index.toString();
        }

        localStorage.setItem(key, dismissedText);
        this.DISMISSED_TEXTS_KEYS.push(key);
    }

}
