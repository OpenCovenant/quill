import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DarkModeService } from '../services/dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-about-document-upload',
    templateUrl: './about-document-upload.component.html',
    styleUrl: './about-document-upload.component.css',
    imports: [CommonModule]
})
export class AboutDocumentUploadComponent {
    baseURL!: string;
    getAboutDocumentUploadURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.initializeURLs();
        this.httpClient
            .get(this.getAboutDocumentUploadURL)
            .subscribe((html: any) => {
                document.getElementById('about-document-upload')!.innerHTML =
                    html['about_document_upload_html'];

                this.handleURLFragmenting();
            });
    }

    private handleURLFragmenting(): void {
        const fragment = this.router.url.split('#')[1];

        if (fragment) {
            this.activatedRoute.fragment.subscribe((f) => {
                document.querySelector('#' + f)?.scrollIntoView();
            });
        }

        document.querySelectorAll('.link-icon').forEach((lI) =>
            lI.addEventListener('click', (e) => {
                const currentFragment = (e.target as any).parentNode.id;
                window.location.href =
                    window.location.pathname +
                    window.location.search +
                    '#' +
                    currentFragment;
                document.querySelector('#' + currentFragment)?.scrollIntoView();
            })
        );
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getAboutDocumentUploadURL =
            this.baseURL + '/api/getAboutDocumentUpload';
    }
}
