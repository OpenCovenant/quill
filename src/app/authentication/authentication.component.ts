import { Component, OnInit } from '@angular/core';
import { FacebookLoginProvider, SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit{

  public loggedIn!: Boolean;
  public user: any;
  private accessToken = '';

  constructor(private authService:SocialAuthService, private httpClient: HttpClient){}
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user 
      this.loggedIn = user != null
    })
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }



}
