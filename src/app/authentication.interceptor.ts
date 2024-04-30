import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (!localStorage.getItem('penda-access-jwt')) {
            return next.handle(request);
        } else {
            const cloneRequest = request.clone({
                headers: request.headers.set(
                    'Authorization',
                    `Bearer ${localStorage.getItem('penda-access-jwt')}`
                )
            });
            return next.handle(cloneRequest);
        }
    }
}
