import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DarkModeService } from './services/dark-mode.service';
import { AuthenticationService } from './services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    title: string = 'Penda';
    reauthenticationModalSubscription$!: Subscription;

    constructor(
        public darkModeService: DarkModeService,
        private authenticationService: AuthenticationService
    ) {}

    ngOnInit(): void {
        this.initializeFBLibrary();
    }

    ngOnDestroy(): void {
        this.reauthenticationModalSubscription$.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.reauthenticationModalSubscription$ =
            this.authenticationService.reauthenticationModal$
                .asObservable()
                .subscribe(() =>
                    (
                        document.getElementById(
                            'authentication-modal-button'
                        )! as HTMLButtonElement
                    ).click()
                );
    }

    private initializeFBLibrary(): void {
        (window as any).fbAsyncInit = function () {
            (<any>window)['FB'].init({
                appId: '',
                cookie: true,
                xfbml: true,
                version: 'v3.1'
            });
            (<any>window)['FB'].AppEvents.logPageView();
        };

        (function (d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.src = 'https://connect.facebook.net/sq_AL/sdk.js';
            fjs?.parentNode?.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }
}
