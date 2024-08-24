import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationGuard = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
        // switchMap(g => ), // TODO: check JWT validity here?
        map((authenticated: boolean) => {
            if (route.url.length === 0) {
                // home page
                return true;
            }

            const pathSuffix = route.url[route.url.length - 1].path;

            const unauthenticatedProfile: boolean =
                pathSuffix === 'profile' && !authenticated;
            const authenticatedAuthentication: boolean =
                pathSuffix === 'authentication' && authenticated;
            const unauthenticatedCheckout: boolean =
                pathSuffix === 'checkout' && !authenticated;

            if (unauthenticatedProfile || authenticatedAuthentication) {
                router.navigate(['/']);
                return false;
            } else if (unauthenticatedCheckout) {
                router.navigate(['/authentication']);
                return false;
            } else {
                return true;
            }
        })
    );
};
