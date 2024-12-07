import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    imports: [CommonModule]
})
export class DashboardComponent {
    constructor(
        public authenticationService: AuthenticationService,
        public darkModeService: DarkModeService
    ) {}
}
