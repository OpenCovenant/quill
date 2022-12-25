import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title: string = 'Penda';
    auth2: any;

    @ViewChild('loginRef', {static: true}) loginElement!: ElementRef;

    constructor() {
    }

    ngOnInit() {
        this.googleAuthSDK();
    }

    callLoginButton() {
        this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
            (googleAuthUser: any) => {
                let profile = googleAuthUser.getBasicProfile();
                console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());

                /* TODO Write Your Code Here */
            }, (error: any) => {
                alert(JSON.stringify(error, undefined, 2));
            });
    }

    googleAuthSDK() {
        (<any>window)['googleSDKLoaded'] = () => {
            (<any>window)['gapi'].load('auth2', () => {
                this.auth2 = (<any>window)['gapi'].auth2.init({
                    client_id: '22458349866-lnvl0d09b12pnbbi7t05dq3r015puj3d.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email',
                    plugin_name: "chat"
                });
                this.callLoginButton();
            });
        }

        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs?.parentNode?.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    }
}
