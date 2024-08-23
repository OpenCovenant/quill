import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../services/dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
    baseURL!: string;
    getPrivacyPolicyURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient,
    ) {
        this.initializeURLs();
        this.httpClient
            .get(this.getPrivacyPolicyURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('privacy-policy')!.innerHTML =
                        html['privacy_policy_html'])
            );
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getPrivacyPolicyURL = this.baseURL + '/api/getPrivacyPolicy';
    }
}
