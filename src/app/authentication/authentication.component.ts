import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '../authentication.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
    constructor(private authenticationService: AuthenticationService, private httpClient: HttpClient) {
    }

    private baseURL!: string;
    private postAccessTokenURL!: string;

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.postAccessTokenURL = this.baseURL + '/api/giveAccessToken';
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
                // this.authenticationService.authenticateUser()

                console.log('login response', response)
                if (response.authResponse) {
                    // this.router.navigate(['dashboard']);
                    (<any>window)['FB'].api(
                        '/me',
                        {
                            fields: 'last_name, first_name, email',
                        },
                        (userInfo: any) => {
                            console.log('user information')
                            console.log(userInfo)
                        },
                    )
                } else {
                    console.log('User login failed')
                }
                this.httpClient.post(this.postAccessTokenURL, {"access_token": response.authResponse.userID})
                    .subscribe(f => console.log('hjwqe', f));
            },
            { scope: 'email' },
        )
    }
}
