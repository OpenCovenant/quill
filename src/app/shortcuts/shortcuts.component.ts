import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.css']
})
export class ShortcutsComponent {
    baseURL!: string;
    getShortcutsURL!: string;

    constructor(
        private http: HttpClient, public darkModeService: DarkModeService) {
        this.initializeURLs();
        this.http
            .get(this.getShortcutsURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('shortcuts')!.innerHTML =
                        html['shortcuts_html'])
            );
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getShortcutsURL = this.baseURL + '/api/getShortcuts';
    }
}
