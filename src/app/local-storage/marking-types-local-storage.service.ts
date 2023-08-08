import { Injectable } from '@angular/core';
import { TextMarking } from '../models/text-marking';

@Injectable({
    providedIn: 'root'
})
export class MarkingTypesLocalStorageService {
    filterUnselectedMarkingTypes(textMarkings: TextMarking[]): TextMarking[] {
        return textMarkings.filter((tM: TextMarking) => {
            if (tM.id) {
                const items = { ...localStorage };
                let b = true;
                Object.entries(items).forEach((e: any) => {
                    if (e[0] === tM.id) {
                        b = e[1] === 'true';
                    }
                });
                return b;
            } else {
                return true;
            }
        });
    }
}
