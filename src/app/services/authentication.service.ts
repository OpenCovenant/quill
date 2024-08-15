import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    baseURL!: string;
    validateJWTURL!: string;
    logoutURL!: string;

    public authenticated$: ReplaySubject<boolean> = new ReplaySubject<boolean>(
        1
    );
    public reauthenticationModal$: Subject<any> = new Subject<any>();
    public user: any = undefined;
    public subscribed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.initializeURLs();
        this.validateJWT();
    }

    isAuthenticated(): Observable<boolean> {
        return this.authenticated$.asObservable();
    }

    isSubscribed(): Observable<boolean> {
        return this.subscribed$.asObservable();
    }

    logout(): void {
        if (this.user.platform === 'facebook') {
            (<any>window)['FB'].getLoginStatus((response: any): void => {
                if (response && response.status === 'connected') {
                    (<any>window)['FB'].logout((): void => {
                        document.location.reload();
                    });
                }
            });
        } else {
            google.accounts.id.disableAutoSelect();
        }

        this.httpClient.post(this.logoutURL, {}).subscribe((): void => {
            this.authenticated$.next(false);
            this.router.navigate(['/']);
            this.user = undefined;
            localStorage.removeItem('penda-access-jwt');
        });
    }

    private validateJWT(): void {
        const access_token: string | null =
            localStorage.getItem('penda-access-jwt');
        if (!access_token) {
            this.authenticated$.next(false);
            return;
        }
        this.httpClient
            .post(this.validateJWTURL, { access_token: access_token })
            .subscribe((r: any) => {
                if (Object.keys(r).length > 0) {
                    this.authenticated$.next(true);
                    this.subscribed$.next(r.subscribed);
                    this.user = {
                        first_name: r.first_name,
                        platform: r.platform
                    };
                } else {
                    this.authenticated$.next(false);
                    // TODO: currently assuming we do not refresh
                    localStorage.removeItem('penda-access-jwt');

                    this.reauthenticationModal$.next({});
                }
            });
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.validateJWTURL = this.baseURL + '/api/checkJWTValidity';
        this.logoutURL = this.baseURL + '/api/logout';
    }
}
