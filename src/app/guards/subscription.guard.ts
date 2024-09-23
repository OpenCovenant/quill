import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export const subscriptionGuard = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    return authService.isSubscribed().pipe(
        map((subscribed: boolean) => {
            const pathSuffix: string = route.url[route.url.length - 1].path;

            const subscribedCheckout: boolean =
                pathSuffix === 'checkout' && subscribed;

            if (subscribedCheckout) {
                router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        })
    );
};
