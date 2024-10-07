import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';
import { map } from 'rxjs';
import { DISMISSED_MARKINGS_KEY } from '../services/constants';
import { SettingsSkeletonComponent } from './settings-skeleton/settings-skeleton.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DarkModeButtonsComponent } from './dark-mode-buttons/dark-mode-buttons.component';

interface MarkingTypeDTO {
    [key: string]: { description: string; enabled: boolean };
}

interface MarkingTypeLocalStorage {
    [key: string]: boolean;
}

@Component({
    standalone: true,
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    imports: [
        SettingsSkeletonComponent,
        CommonModule,
        FormsModule,
        RouterModule,
        DarkModeButtonsComponent
    ]
})
export class SettingsComponent implements OnInit {
    SELECTED_MARKING_TYPES_KEY = 'penda-selected-marking-types';
    IMMEDIATE_MARKINGS_KEY = 'penda-immediate-markings';
    IMMEDIATE_BOARD_MARKINGS_KEY = 'penda-immediate-board-markings';

    baseURL!: string;
    markingTypesURL!: string;
    isLoading: boolean = false;

    markingTypes: any[][] = [];
    dismissedMarkings: string[] = [];
    immediateMarkings: boolean;
    immediateBoardMarkings: boolean;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient
    ) {
        this.dismissedMarkings =
            (JSON.parse(
                localStorage.getItem(DISMISSED_MARKINGS_KEY)!
            ) as string[]) ?? [];
        this.immediateMarkings =
            localStorage.getItem(this.IMMEDIATE_MARKINGS_KEY) === 'true';
        this.immediateBoardMarkings =
            localStorage.getItem(this.IMMEDIATE_BOARD_MARKINGS_KEY) === 'true';
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.initializeURLs();
        this.httpClient
            .get(this.markingTypesURL)
            .pipe(map((data: any) => data['marking_types']))
            .subscribe((markingTypes: MarkingTypeDTO) => {
                this.markingTypes = Object.entries(markingTypes).filter(
                    (mT: any) => mT[1].enabled
                );

                if (!localStorage.getItem(this.SELECTED_MARKING_TYPES_KEY)) {
                    const selectedMarkingTypes: MarkingTypeLocalStorage = {};
                    this.markingTypes.forEach(
                        (mT) => (selectedMarkingTypes[mT[0]] = true)
                    );
                    localStorage.setItem(
                        this.SELECTED_MARKING_TYPES_KEY,
                        JSON.stringify(selectedMarkingTypes)
                    );
                } else {
                    // NOTE: lot of cases here in which more/less types come from the endpoint than are in local storage
                    const selectedMarkingTypes: MarkingTypeLocalStorage =
                        JSON.parse(
                            localStorage.getItem(
                                this.SELECTED_MARKING_TYPES_KEY
                            )!
                        );
                    this.markingTypes = this.markingTypes.map((mT: any) => {
                        mT[1].enabled = selectedMarkingTypes[mT[0]] === true;
                        return mT;
                    });
                }
                this.isLoading = false;
            });
    }

    onMarkingTypeSelection(markingTypeID: string, selected: boolean): void {
        const selectedMarkingTypes = JSON.parse(
            localStorage.getItem(this.SELECTED_MARKING_TYPES_KEY)!
        );
        selectedMarkingTypes[markingTypeID] = selected;
        localStorage.setItem(
            this.SELECTED_MARKING_TYPES_KEY,
            JSON.stringify(selectedMarkingTypes)
        );
    }

    onImmediateMarkingsSwitch(selected: boolean): void {
        localStorage.setItem(this.IMMEDIATE_MARKINGS_KEY, String(selected));

        if (!selected) {
            this.immediateBoardMarkings = false;
            localStorage.setItem(
                this.IMMEDIATE_BOARD_MARKINGS_KEY,
                String(selected)
            );
        }
    }

    onImmediateBoardMarkingsSwitch(selected: boolean): void {
        localStorage.setItem(
            this.IMMEDIATE_BOARD_MARKINGS_KEY,
            String(selected)
        );
    }

    undoMarkingDismissal(dismissedMarking: string): void {
        let dismissedMarkings: string[] = JSON.parse(
            localStorage.getItem(DISMISSED_MARKINGS_KEY)!
        ) as string[];
        dismissedMarkings = dismissedMarkings.filter(
            (dM) => dM !== dismissedMarking
        );
        this.dismissedMarkings = dismissedMarkings;
        localStorage.setItem(
            DISMISSED_MARKINGS_KEY,
            JSON.stringify(this.dismissedMarkings)
        );
    }

    undoMarkingsDismissal(): void {
        localStorage.setItem(DISMISSED_MARKINGS_KEY, JSON.stringify([]));
        this.dismissedMarkings = JSON.parse(
            localStorage.getItem(DISMISSED_MARKINGS_KEY)!
        ) as string[];
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.markingTypesURL = `${this.baseURL}/api/getMarkingTypes`;
    }
}
