import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    constructor(
        public authenticationService: AuthenticationService,
        public darkModeService: DarkModeService
    ) {}
}
