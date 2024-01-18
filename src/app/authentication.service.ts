import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public authenticated: boolean = true;

    constructor() {
        setTimeout(() => {
            console.log('Signing out...');
            this.authenticated = false;
        }, 10_000);
    }
}
