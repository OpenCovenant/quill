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

    public authenticated: boolean = false;
    public user: any = undefined;

    constructor(private http: HttpClient) {
        this.initializeURLs();
        const access_token = localStorage.getItem('penda-access-jwt');
        // console.log('act', access_token)
        if (!access_token) {
            return;
        }
        this.isJWTValid(access_token);

        // setTimeout(() => {
        //     console.log('Signing out...');
        //     this.authenticated = true;
        // }, 5_000);
    }

    logout(): void {
        this.authenticated = false;
        this.user = undefined;
        this.http.post(this.logoutURL, {'access_token':2 }).subscribe((r: any) => {});
    }

    private isJWTValid(access_token: string): void {
        this.http.post(this.validateJWTURL, {'access_token':access_token }).subscribe((r: any) => {
            const email: boolean = r.email;
            // console.log(email);
            if (email) {
                this.authenticated = true;
                this.user = {email: email}
            } else {
                console.log('the current access token has expired');// TODO: now remove the KV-pair from LS? corresponds to a dialog shown
                const refresh_token: string | null = localStorage.getItem('penda-refresh-jwt');
                // console.log(refresh_token);
                this.authenticated = false;
                if (!email && refresh_token) { // TODO should switchMap (or similar) be used here if we are going to make another call
                    console.log('attempting to refresh...');
                    // TODO: implement
                }
            }
        })
    }

    initializeURLs() : void{
        this.baseURL = environment.baseURL;
        this.validateJWTURL = this.baseURL + '/api/vad';
        this.logoutURL = this.baseURL + '/api/logout';
    }
}
