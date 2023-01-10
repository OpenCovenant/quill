import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    loggedIn = false;

    isAuthenticated() {
        return this.loggedIn;
    }

    constructor() {}
}
