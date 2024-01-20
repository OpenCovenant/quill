import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public authenticated: boolean = false;
    public user: any = undefined;

    constructor() {
        // setTimeout(() => {
        //     console.log('Signing out...');
        //     this.authenticated = true;
        // }, 5_000);
    }

    logout(): void {
        this.authenticated = false;
        this.user = undefined;
    }
}
