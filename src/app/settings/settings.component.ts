import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    ALREADY_MADE_MARKING_TYPE_SELECTIONS =
        'penda-has-stored-marking-type-selections';

    baseURL!: string;
    markingTypesURL!: string;
    isLoading: boolean = false;

    markingTypes: any[] = [];
    dismissedMarkings: string[] = [];

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.dismissedMarkings =
            (JSON.parse(
                localStorage.getItem('penda-dismissed-markings')!
            ) as string[]) ?? [];
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.initializeURLs();
        // TODO: consider making changes to `LocalStorageService`
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
            this.isLoading = false;
        });
    }

    onMarkingTypeSelection(markingTypeID: string, selected: boolean): void {
        localStorage.setItem(markingTypeID, String(selected));
    }

    undoMarkingDismissal($event: MouseEvent): void {
        const dismissedMarking = ($event.target as any).firstChild.getAttribute(
            'data-dismissed-marking'
        );
        let dismissedMarkings: string[] = JSON.parse(
            localStorage.getItem('penda-dismissed-markings')!
        ) as string[];
        dismissedMarkings = dismissedMarkings.filter(
            (dM) => dM !== dismissedMarking
        );
        this.dismissedMarkings = dismissedMarkings;
        localStorage.setItem(
            'penda-dismissed-markings',
            JSON.stringify(this.dismissedMarkings)
        );
    }

    undoMarkingsDismissal(): void {
        localStorage.setItem('penda-dismissed-markings', JSON.stringify([]));
        this.dismissedMarkings = JSON.parse(
            localStorage.getItem('penda-dismissed-markings')!
        ) as string[];
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.markingTypesURL = `${this.baseURL}/api/getMarkingTypes`;
    }
}
