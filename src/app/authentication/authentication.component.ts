import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
    auth2: any;

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) {}
    @ViewChild('loginRef', { static: true }) loginElement!: ElementRef;

    ngOnInit() {
        this.loadGoogleAuthSDK();
        this.fbLibrary();
    }

    callLoginButton() {
        this.auth2.attachClickHandler(
            this.loginElement.nativeElement,
            {},
            (googleAuthUser: any) => {
                let profile = googleAuthUser.getBasicProfile();
                console.log(
                    'Token: ' + googleAuthUser.getAuthResponse().id_token
                );
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                /* TODO add code here */
                this.authService.authenticateUser();

                this.router.navigate(['dashboard']);
            },
            (error: any) => {
                // do nothing for now
            }
        );
    }

    loadGoogleAuthSDK() {
        (<any>window)['googleSDKLoaded'] = () => {
            (<any>window)['gapi'].load('auth2', () => {
                this.auth2 = (<any>window)['gapi'].auth2.init({
                    client_id: 'yourID',
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email',
                    plugin_name: 'chat'
                });
                this.callLoginButton();
            });
        };

        (function (d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.src =
                'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
            fjs?.parentNode?.insertBefore(js, fjs);
        })(document, 'script', 'google-jssdk');
    }

    //facebook
    fbLibrary() {
        (window as any).fbAsyncInit = function () {
            (<any>window)['FB'].init({
                appId: 'yourID',
                cookie: true,
                xfbml: true,
                version: 'v3.1'
            });
            (<any>window)['FB'].AppEvents.logPageView();
        };

        (function (d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.src = 'https://connect.facebook.net/sq_AL/sdk.js';
            fjs?.parentNode?.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }

    login() {
        (<any>window)['FB'].login(
            (response: { authResponse: any }) => {
                this.authService.authenticateUser();

                console.log('login response', response);
                if (response.authResponse) {
                    this.router.navigate(['dashboard']);
                    (<any>window)['FB'].api(
                        '/me',
                        {
                            fields: 'last_name, first_name, email'
                        },
                        (userInfo: any) => {
                            console.log('user information');
                            console.log(userInfo);
                        }
                    );
                } else {
                    console.log('User login failed');
                }
            },
            { scope: 'email' }
        );
    }
}
