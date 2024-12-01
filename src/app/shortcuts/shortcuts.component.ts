import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DarkModeService } from '../services/dark-mode.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.css'],
    imports: [CommonModule]
})
export class ShortcutsComponent {
    baseURL!: string;
    getShortcutsURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private httpClient: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.initializeURLs();
        this.httpClient.get(this.getShortcutsURL).subscribe((html: any) => {
            document.getElementById('shortcuts')!.innerHTML =
                html['shortcuts_html'];

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
        this.getShortcutsURL = this.baseURL + '/api/getShortcuts';
    }
}
