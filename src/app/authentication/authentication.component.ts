import { Component, OnInit} from '@angular/core';
import { FacebookLoginProvider, SocialAuthService,GoogleLoginProvider,SocialLoginModule} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit{

  public loggedIn!: Boolean;
  public user: any;

  constructor(private authService:SocialAuthService, private httpClient: HttpClient, private _router: Router){}
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    })
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this._router.navigate(['dashboard']);
  }

  signInWithGoogle(): void{
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this._router.navigate(['dashboard']);
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshToken(): void {
    this.authService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
  }
} 
