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
    private baseURL!: string;
    private postAccessTokenURL!: string;

    constructor(private authenticationService: AuthenticationService, private httpClient: HttpClient,
                private router: Router, private zone: NgZone ) {
    }

    ngOnInit(): void {
        this.initializeURLs();
    }

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.postAccessTokenURL = this.baseURL + '/api/token/';
    }

    login(): void {
        (<any>window)['FB'].login(
            (response: { authResponse: any }) => {
                console.log('login response', response)
                if (!response.authResponse) {
                    console.log('User login failed');
                    return;
                }
                this.httpClient.post(this.postAccessTokenURL, { "act": response.authResponse.accessToken })
                    .subscribe((f: any) => {
                        // console.log('postAccessToken output', f);

                        this.authenticationService.authenticated = true;
                        this.authenticationService.user = {email: f.email};

                        localStorage.setItem('penda-access-jwt', f.access_token)
                        localStorage.setItem('penda-refresh-jwt', f.refresh_token)

                        this.zone.run(() => {
                            this.router.navigate(['/']);
                        });
                    });
            },
            { scope: 'email' },
        )
    }
}
