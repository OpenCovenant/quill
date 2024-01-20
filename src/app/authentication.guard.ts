import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const pathSuffix = route.url[route.url.length - 1].path;

        const unauthenticatedProfile = pathSuffix === 'profile' && !this.authService.authenticated;
        const authenticatedAuthentication = pathSuffix === 'authentication' && this.authService.authenticated

        if (unauthenticatedProfile || authenticatedAuthentication){
            this.router.navigate(['/']);
            return false;
        } else {
            return true
        }
    }
}
