import {
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
declare const paypal: any;

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    baseURL!: string;
    storePayPalSubscriptionURL!: string;
    allowedPaymentSources: string[] = ['paypal', 'card'];

    @ViewChild('paypalButton', { static: true }) paypalButton!: ElementRef;

    constructor(
        private http: HttpClient,
        private router: Router,
        private zone: NgZone,
        private authenticationService: AuthenticationService
    ) {
        this.initializeURLs();
    }

    ngOnInit(): void {
        this.renderPaypalButton();
    }

    renderPaypalButton(): void {
        paypal
            .Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createSubscription: (data: any, actions: any) => {
                    const tomorrowsNow: Date = new Date();
                    tomorrowsNow.setDate(tomorrowsNow.getDate() + 1);
                    return actions.subscription.create({
                        plan_id: '' // Replace with your PayPal plan ID
                    });
                },
                onApprove: (data: any): void => {
                    if (
                        !this.allowedPaymentSources.includes(data.paymentSource)
                    ) {
                        console.warn('Odd payment source, cancelling...');
                    }
                    this.http
                        .post(this.storePayPalSubscriptionURL, data)
                        .subscribe(() => {
                            const navigationExtras: NavigationExtras = {
                                state: { payload: 'penda-thank-you' }
                            };

                            this.zone.run(() => {
                                this.authenticationService.subscribed$.next(
                                    true
                                );
                                this.router.navigate(['/'], navigationExtras);
                            });
                        });
                },
                onError(err: any): void {
                    // For example, redirect to a specific error page
                    // window.location.href = "/your-error-page-here";
                    console.log('erred');
                }
            })
            .render(this.paypalButton.nativeElement);
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.storePayPalSubscriptionURL =
            this.baseURL + '/api/storePayPalSubscription';
    }
}
