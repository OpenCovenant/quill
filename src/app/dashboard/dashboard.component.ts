import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    baseURL!: string;
    getDashboardURL!: string;

    constructor(
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.http
            .get(this.getDashboardURL)
            .subscribe(
                (html: any) =>
                    (document.getElementById('dashboard')!.innerHTML =
                        html['dashboard_html'])
            );
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getDashboardURL = this.baseURL + '/api/getDashboard';
    }
}
