import { Component } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    imports: [CommonModule]
})
export class ProfileComponent {
    // TODO we do need this below here now but when/why was this added?
    isLoading: boolean = false;

    baseURL!: string;
    deactivateAccountURL!: string;
    cancelSubscriptionURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        public authenticationService: AuthenticationService,
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.initializeURLs();
    }

    closeAccount(): void {
        this.httpClient.post(this.deactivateAccountURL, {}).subscribe(() => {
            // give feed to user that their account has been successfully deactivated
            // TODO: clear localStorage and what not
            // TODO: sign user out (from anything that's left here)
            // TODO: route home?
            this.authenticationService.logout();
            this.router.navigate(['/']);
        });
    }

    cancelSubscription(): void {
        this.httpClient.post(this.cancelSubscriptionURL, {}).subscribe((c) => {
            this.authenticationService.subscribed$.next(false);
        });
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.deactivateAccountURL = this.baseURL + '/api/closeAccount';
        this.cancelSubscriptionURL =
            this.baseURL + '/api/cancelPayPalSubscription';
    }
}
