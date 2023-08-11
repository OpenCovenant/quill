import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    baseURL!: string;
    getMarkingTypes!: string;
    getMarkingTypesCount!: string;
    markingTypesCount: number = 0;
    markingTypes: any = {};
    markingTypeKeys: Array<string> = [];
    ALREADY_MADE_DARKMODE_STATUS = 'penda-has-stored-darkmode-status';
    darkModeTypes: boolean = true;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http.get(this.getMarkingTypesCount).subscribe((data: any) => {
            this.markingTypesCount = data['count'];
        });
        this.http.get(this.getMarkingTypes).subscribe((data: any) => {
            this.markingTypes = data['marking_types'];
            this.markingTypeKeys = Object.keys(this.markingTypes);
        });
    }

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getMarkingTypes = `${this.baseURL}/api/getMarkingTypes`;
        this.getMarkingTypesCount = `${this.baseURL}/api/getMarkingTypesCount`;
    }

    // TODO: is this even used?
    closeOffcanvas() {
        document.getElementById('offcanvasCloseButton')!.click();
    }
    saveDarkModeStatusOnLocalStorageMethod (){
    const saveDarkModeStatusOnLocalStorage = localStorage.getItem(
        this.ALREADY_MADE_DARKMODE_STATUS);
        if (!saveDarkModeStatusOnLocalStorage){
            if(this.darkModeTypes){
                localStorage.setItem(
                    this.ALREADY_MADE_DARKMODE_STATUS,
                    'true'
                );
        }
    } if (saveDarkModeStatusOnLocalStorage === 'false'){
            this.darkModeTypes = false;
        }
    }

    onMarkingTypeSelection(statusType: DarkModeService, selected: boolean): void {
        localStorage.setItem(statusType, String(selected));
    }

    protected readonly localStorage = localStorage;
}
