import { Injectable, OnInit } from '@angular/core'
import { TextMarking } from '../models/text-marking';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { map, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class MarkingTypesLocalStorageService implements OnInit {
    ALREADY_MADE_MARKING_TYPE_SELECTIONS =
        'penda-has-stored-marking-type-selections';

    baseURL!: string;
    markingTypesURL!: string;

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.initializeURLs();
    }

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

    initializeMarkingTypes(): void {
        this.http.get(this.markingTypesURL).subscribe((data: any) => {
            if (
                !localStorage.getItem(this.ALREADY_MADE_MARKING_TYPE_SELECTIONS)
            ) {
                localStorage.setItem(
                    this.ALREADY_MADE_MARKING_TYPE_SELECTIONS,
                    'true'
                );
                this.markingTypes = Object.entries(
                    data['marking_types']
                ).filter((e: any) => e[1].enabled);
                this.markingTypes.forEach((mT) =>
                    localStorage.setItem(mT[0], mT[1].enabled)
                );
            } else {
                // TODO: lot of cases here in which more/less types come from the endpoint than are in local storage
                this.markingTypes = Object.entries(data['marking_types'])
                    .filter((e: any) => e[1].enabled)
                    .map((e: any) => {
                        e[1].enabled = localStorage.getItem(e[0]) === 'true';
                        return e;
                    });
            }
        });
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.markingTypesURL = `${this.baseURL}/api/getMarkingTypes`;
    }

}
