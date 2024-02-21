import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
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
        return this.authService.isSubscribed().pipe(
            map((subscribed: boolean) => {
                const pathSuffix: string = route.url[route.url.length - 1].path;

                const subscribedCheckout: boolean =
                    pathSuffix === 'checkout' && subscribed;

                if (subscribedCheckout) {
                    this.router.navigate(['/']);
                    return false;
                } else {
                    return true;
                }
            })
        );
    }
}
