import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    imports: [CommonModule]
})
export class AboutComponent {
    baseURL!: string;
    getAboutURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.initializeURLs();
        this.httpClient.get(this.getAboutURL).subscribe((html: any) => {
            document.getElementById('about')!.innerHTML = html['about_html'];

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
        this.getAboutURL = this.baseURL + '/api/getAbout';
    }
}
