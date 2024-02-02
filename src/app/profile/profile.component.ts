import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    // TODO we do need this below here now but when/why was this added?
    isLoading: boolean = false;

    baseURL!: string;
    deactivateAccountURL!: string;
    cancelSubscriptionURL!: string;


    constructor(private http: HttpClient, private router: Router, public darkModeService: DarkModeService, public authenticationService: AuthenticationService) {
        this.initializeURLs();
    }

    deactivateAccount(): void {
        console.log('deactivating account...')
        this.http.post(this.deactivateAccountURL, {}).subscribe(() => {
            // give feed to user that their account has been successfully deactivated
            // TODO: clear localStorage and what not
            // TODO: sign user out (from anything that's left here)
            // TODO: route home?
            this.router.navigate(['/']);
        });
    }

    cancelSubscription(): void {
        this.http.post(this.cancelSubscriptionURL, {}).subscribe(c => {
            console.log('Subscription has been cancelled.');
            this.authenticationService.subscribed$.next(false);
        })
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.deactivateAccountURL = this.baseURL + '/api/deactivateAccount';
        this.cancelSubscriptionURL = this.baseURL + '/api/cancelPayPalSubscription';
    }
}
