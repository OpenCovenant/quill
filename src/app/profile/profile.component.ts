import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Router } from '@angular/router'
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    // TODO we do need this below here now but when/why was this added?
    isLoading = false;

    baseURL!: string;
    deactivateAccountURL!: string;


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

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.deactivateAccountURL = this.baseURL + '/api/deactivateAccount';
    }

    cancelSubscription(): void {
        console.log('trying to cancel a subscription...')
    }
}
