import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DarkModeService } from '../dark-mode.service'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
    baseURL!: string;
    getPrivacyPolicyURL!: string;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http
            .get(this.getPrivacyPolicyURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('privacy-policy')!.innerHTML =
                        html['privacy_policy_html'])
            );
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getPrivacyPolicyURL = this.baseURL + '/api/getPrivacyPolicy';
    }
}
