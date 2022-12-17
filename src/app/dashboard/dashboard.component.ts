import { Component, OnInit } from '@angular/core';
import { FacebookLoginProvider, SocialAuthService} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  public loggedIn!: Boolean;
  public user: any;

  constructor(private authService:SocialAuthService, private httpClient: HttpClient, private _router: Router){}
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user 
      this.loggedIn = user != null
    })
  }

  signOut(): void {
    this.authService.signOut();
    this._router.navigate(['authentication'])
  }

}
