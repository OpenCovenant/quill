import { Component, NgZone, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';
declare const google: any;

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
    private baseURL!: string;
    private postAccessTokenURL!: string;

    constructor(
        private authenticationService: AuthenticationService,
        private httpClient: HttpClient,
        private router: Router,
        private zone: NgZone,
        public darkModeService: DarkModeService
    ) {}

    ngOnInit(): void {
        this.initializeURLs();
        this.initializeGoogleLibrary();
    }

    login(): void {
        (<any>window)['FB'].login(
            (response: { authResponse: any }) => {
                if (!response.authResponse) {
                    console.log('User login failed');
                    return;
                }
                this.httpClient
                    .post(this.postAccessTokenURL, {
                        fb_access_token: response.authResponse.accessToken
                    })
                    .subscribe((f: any) => {
                        this.authenticationService.authenticated$.next(true);
                        this.authenticationService.user = {
                            first_name: f.first_name,
                            platform: f.platform
                        };
                        this.authenticationService.subscribed$.next(
                            f.subscribed
                        );

                        localStorage.setItem(
                            'penda-access-jwt',
                            f.access_token
                        );

                        let navigationExtras: NavigationExtras = {};
                        if (f.onboarding) {
                            navigationExtras = {
                                state: { payload: 'penda-welcome' }
                            };
                        }

                        this.zone.run(() => {
                            this.router.navigate(['/'], navigationExtras);
                        });
                    });
            },
            { scope: 'email' }
        );
    }

    private initializeGoogleLibrary(): void {
        google.accounts.id.initialize({
            client_id: '',
            callback: (v: any): void => {
                const accessToken = v.credential;

                this.httpClient
                    .post(this.postAccessTokenURL, {
                        g_access_token: accessToken
                    })
                    .subscribe((f: any) => {
                        this.authenticationService.authenticated$.next(true);
                        this.authenticationService.user = {
                            first_name: f.first_name,
                            platform: f.platform
                        };
                        this.authenticationService.subscribed$.next(
                            f.subscribed
                        );

                        localStorage.setItem(
                            'penda-access-jwt',
                            f.access_token
                        );

                        let navigationExtras: NavigationExtras = {};
                        if (f.onboarding) {
                            navigationExtras = {
                                state: { payload: 'penda-welcome' }
                            };
                        }

                        this.zone.run(() => {
                            this.router.navigate(['/'], navigationExtras);
                        });
                    });
            }
        });
        google.accounts.id.renderButton(
            document.getElementById('google-sign-in-button'),
            { theme: 'outline', size: 'large', locale: 'sq', width: 246 }
        );
        google.accounts.id.prompt();
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.postAccessTokenURL = this.baseURL + '/api/authenticate';
    }
}
