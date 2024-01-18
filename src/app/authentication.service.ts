import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    public authenticated: boolean = false;

  constructor() {
      setTimeout(() => {
          console.log("Signing out...")
          this.authenticated = false
          }, 30_000
      )
  }
}
