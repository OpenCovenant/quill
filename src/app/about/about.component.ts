import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    baseURL!: string;
    getAboutURL!: string;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http
            .get(this.getAboutURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('about')!.innerHTML =
                        html['about_html'])
            );
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getAboutURL = this.baseURL + '/api/getAbout';
    }
}
