import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { map, Observable } from 'rxjs'
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
        return this.authService.isAuthenticated().pipe(
            map((authenticated: boolean) => {
                const pathSuffix = route.url[route.url.length - 1].path;

                const unauthenticatedProfile = pathSuffix === 'profile' && !authenticated;
                const authenticatedAuthentication = pathSuffix === 'authentication' && authenticated;
                const unauthenticatedCheckout = pathSuffix === 'checkout' && !authenticated;

                if (unauthenticatedProfile || authenticatedAuthentication) {
                    this.router.navigate(['/']);
                    return false;
                } else if (unauthenticatedCheckout) {
                    this.router.navigate(['/authentication']);
                    return false;
                } else {
                    return true
                }
            })
        );
    }
}
