import { Component, NgZone, OnInit } from '@angular/core'
import { AuthenticationService } from '../authentication.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Router } from '@angular/router'

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
    constructor(private authenticationService: AuthenticationService, private httpClient: HttpClient,
                private router: Router, private zone: NgZone ) {
    }

    private baseURL!: string;
    private postAccessTokenURL!: string;

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.postAccessTokenURL = this.baseURL + '/api/token/';
    }


    ngOnInit(): void {
        this.fbLibrary();
        this.initializeURLs();
    }

//facebook
    fbLibrary() {
        (window as any).fbAsyncInit = function() {
            (<any>window)['FB'].init({
                appId: 'yourID',
                cookie: true,
                xfbml: true,
                version: 'v3.1',
            });
            (<any>window)['FB'].AppEvents.logPageView()
        };

        (function(d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
                return
            }
            js = d.createElement('script')
            js.id = id
            js.src = 'https://connect.facebook.net/sq_AL/sdk.js'
            fjs?.parentNode?.insertBefore(js, fjs)
        })(document, 'script', 'facebook-jssdk')
    }

    login() {
        (<any>window)['FB'].login(
            (response: { authResponse: any }) => {
                console.log('login response', response)
                if (!response.authResponse) {
                    console.log('User login failed');
                    return;
                }
                this.httpClient.post(this.postAccessTokenURL, { "act": response.authResponse.accessToken })
                    .subscribe((f: any) => {
                        console.log('postAccessToken output', f);

                        this.authenticationService.authenticated = true;
                        this.authenticationService.user = {username: f.username};

                        this.zone.run(() => {
                            this.router.navigate(['/']);
                        });
                    });
            },
            { scope: 'email' },
        )
    }
}
