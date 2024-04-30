import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DarkModeService } from '../services/dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.css']
})
export class ShortcutsComponent {
    baseURL!: string;
    getShortcutsURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private http: HttpClient
    ) {
        this.initializeURLs();
        this.http
            .get(this.getShortcutsURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('shortcuts')!.innerHTML =
                        html['shortcuts_html'])
            );
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getShortcutsURL = this.baseURL + '/api/getShortcuts';
    }
}
