import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

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

    constructor(private http: HttpClient, private router: Router) {
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
        (<any>window)['FB'].getLoginStatus(function (response: any) {
            if (response && response.status === 'connected') {
                (<any>window)['FB'].logout(function (r: any) {
                    document.location.reload();
                });
            }
        });

        this.http.post(this.logoutURL, {}).subscribe(() => {
            this.authenticated$.next(false);
            this.router.navigate(['/']);
            this.user = undefined;
            localStorage.removeItem('penda-access-jwt');
            localStorage.removeItem('penda-refresh-jwt');
        });
    }

    private validateJWT(): void {
        const access_token: string | null =
            localStorage.getItem('penda-access-jwt');
        if (!access_token) {
            this.authenticated$.next(false);
            return;
        }
        this.http
            .post(this.validateJWTURL, { access_token: access_token })
            .subscribe((r: any) => {
                if (r.email) {
                    this.authenticated$.next(true);
                    this.subscribed$.next(r.subscribed);
                    this.user = {
                        email: r.email,
                        first_name: r.first_name,
                        last_name: r.last_name
                    };
                } else {
                    this.authenticated$.next(false);
                    // TODO: currently assuming we do not refresh
                    localStorage.removeItem('penda-access-jwt');
                    localStorage.removeItem('penda-refresh-jwt');

                    this.reauthenticationModal$.next({});
                    // console.log('the current access token has expired');// TODO: now remove the KV-pair from LS? corresponds to a dialog shown
                    // const refresh_token: string | null = localStorage.getItem('penda-refresh-jwt');
                    // // console.log(refresh_token);
                    // this.authenticated = false;
                    // if (!email && refresh_token) { // TODO should switchMap (or similar) be used here if we are going to make another call
                    //     console.log('attempting to refresh...');
                    //     // TODO: implement
                    // }
                }
            });
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.validateJWTURL = this.baseURL + '/api/checkJWTValidity';
        this.logoutURL = this.baseURL + '/api/logout';
    }
}
