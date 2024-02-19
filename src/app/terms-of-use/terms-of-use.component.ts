import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent {
    baseURL!: string;
    getTermsOfUseURL!: string;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http
            .get(this.getTermsOfUseURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('terms-of-use')!.innerHTML =
                        html['terms_of_use_html'])
            );
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getTermsOfUseURL = this.baseURL + '/api/getTermsOfUse';
    }
}
