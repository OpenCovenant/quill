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
    DARK_MODE = 'penda-dark-mode';

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

        this.initializeDarkMode();
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

    initializeDarkMode(): void  {
        const alreadySetDarkMode: string | null = localStorage.getItem(this.DARK_MODE);
        if (!alreadySetDarkMode) {
            localStorage.setItem(
                this.DARK_MODE,
                'false'
            );
            this.darkModeService.isDarkMode = false;
        } else {
            if (alreadySetDarkMode === 'false') {
                this.darkModeService.isDarkMode = false;
            }

            if (alreadySetDarkMode === 'true') {
                this.darkModeService.isDarkMode = true;
            }
        }
    }

    onDarkModeChange(): void {
        localStorage.setItem(this.DARK_MODE, String(this.darkModeService.isDarkMode));
    }
}
