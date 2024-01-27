import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
declare const paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    baseURL!: string;
    storePayPalSubscriptionURL!: string;

    @ViewChild('paypalButton', { static: true }) paypalButton!: ElementRef;

    constructor(private http: HttpClient) {
        this.initializeURLs();
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.storePayPalSubscriptionURL = this.baseURL + '/api/storePayPalSubscription';
    }

    ngOnInit(): void {
        this.renderPaypalButton();
    }

    allowedPaymentSources = ['paypal', 'card']
    renderPaypalButton(): void {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color:  'gold',
                shape:  'rect',
                label:  'paypal'
            },
            createSubscription: (data: any, actions: any) => {
                return actions.subscription.create({
                        'plan_id': '', // Replace with your PayPal plan ID
                    });
            },
            onApprove: (data: any, actions: any): void => {
                if (!this.allowedPaymentSources.includes(data.paymentSource)) {
                    console.log('Odd payment source, cancelling...');
                }
                // this.http.post(this.storePayPalSubscription, data).subscribe((v: any) => {
                //     console.log('Subscription has been created, thank you!');
                //     // TODO: route here
                // })
                console.log(data, actions)
                // alert('Subscription created!');
                // You can redirect or perform other actions after subscription approval
            },
            onCancel(data: any): void {
                console.log('cancelled')
                // remove created plan in onClick?

                // Show a cancel page, or return to cart
            },
            onError(err: any): void {
                // For example, redirect to a specific error page
                // window.location.href = "/your-error-page-here";
                console.log('erred')
            }
        }).render(this.paypalButton.nativeElement);
    }
}
