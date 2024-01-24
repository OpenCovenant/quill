import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    baseURL!: string;
    validateJWTURL!: string;
    logoutURL!: string;
    authenticationModalButton: HTMLButtonElement | undefined;

    public authenticated: boolean = false;
    public user: any = undefined;

    constructor(private http: HttpClient) {
        this.initializeURLs();
        const access_token: string | null = localStorage.getItem('penda-access-jwt');
        if (!access_token) {
            return;
        }
        this.isJWTValid(access_token);
    }

    logout(): void {
        (<any>window)['FB'].getLoginStatus(function(response:any) {
            if (response && response.status === 'connected') {
                (<any>window)['FB'].logout(function(r:any) {
                    document.location.reload();
                });
            }
        });

        this.http.post(this.logoutURL, {}).subscribe((r: any) => {
            this.authenticated = false;
            this.user = undefined;
            localStorage.removeItem('penda-access-jwt')
            localStorage.removeItem('penda-refresh-jwt')
        });
    }

    private isJWTValid(access_token: string): void {
        this.http.post(this.validateJWTURL, {'access_token':access_token }).subscribe((r: any) => {
            const email: boolean = r.email;
            if (email) {
                this.authenticated = true;
                this.user = {email: email}
            } else {
                // TODO: currently assuming we do not refresh
                localStorage.removeItem('penda-access-jwt');
                localStorage.removeItem('penda-refresh-jwt');

                setTimeout(() => {
                    this.authenticationModalButton?.click()
                }, 500)
                return;
                // console.log('the current access token has expired');// TODO: now remove the KV-pair from LS? corresponds to a dialog shown
                // const refresh_token: string | null = localStorage.getItem('penda-refresh-jwt');
                // // console.log(refresh_token);
                // this.authenticated = false;
                // if (!email && refresh_token) { // TODO should switchMap (or similar) be used here if we are going to make another call
                //     console.log('attempting to refresh...');
                //     // TODO: implement
                // }
            }
        })
    }

    initializeURLs() : void{
        this.baseURL = environment.baseURL;
        this.validateJWTURL = this.baseURL + '/api/vad';
        this.logoutURL = this.baseURL + '/api/logout';
    }

    fetchAuthenticationModalButton(o: HTMLButtonElement): void {
        this.authenticationModalButton = o
    }
}
