import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent {
    baseURL!: string;
    getTermsAndConditionsURL!: string;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http
            .get(this.getTermsAndConditionsURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById(
                        'terms-and-conditions'
                    )!.innerHTML = html['terms_and_conditions_html'])
            );
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getTermsAndConditionsURL =
            this.baseURL + '/api/getTermsAndConditions';
    }
}
