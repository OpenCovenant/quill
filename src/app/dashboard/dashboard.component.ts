import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}
    
    signOut(){

        (<any>window)['FB'].logout((response: any) => {
            // user is now logged out from facebook
            this.router.navigate(['authentication']);
        });
    

        (<any>window)['gapi'].auth2
        //user is now logged out from google
            .getAuthInstance()
            .signOut(this.router.navigate(['authentication']));
    
  }
}
