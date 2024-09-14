import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

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

    constructor(
        public authenticationService: AuthenticationService,
        public darkModeService: DarkModeService,
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.initializeURLs();
        this.loadMarkingTypes();
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getMarkingTypes = `${this.baseURL}/api/getMarkingTypes`;
        this.getMarkingTypesCount = `${this.baseURL}/api/getMarkingTypesCount`;
    }

    private loadMarkingTypes(): void {
        this.httpClient
            .get(this.getMarkingTypesCount)
            .subscribe((data: any) => {
                this.markingTypesCount = data['count'];
            });
        this.httpClient.get(this.getMarkingTypes).subscribe((data: any) => {
            this.markingTypes = data['marking_types'];
            this.markingTypeKeys = Object.keys(this.markingTypes);
        });
    }

    isSettingsRoute(): boolean {
        return this.router.url === '/settings';
    }

    toggleDarkMode(): void {
        this.darkModeService.toggleDarkMode();
    }

    logout(): void {
        this.authenticationService.logout();
    }
}
