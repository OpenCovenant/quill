import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
declare const paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    @ViewChild('paypalButton', { static: true }) paypalButton!: ElementRef;

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
        this.renderPaypalButton();
    }

    allowedPaymentSources = ['paypal', 'card']
    renderPaypalButton():void {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color:  'gold',
                shape:  'rect',
                label:  'paypal'
            },
            onClick:() : void => {
                console.log('clicked');
            },
            onApprove: (data:any, actions:any): void => {
                if (!this.allowedPaymentSources.includes(data.paymentSource)) {
                    console.log('Odd payment source, cancelling...');
                }
                console.log(data, actions)
                // alert('Subscription created!');
                // You can redirect or perform other actions after subscription approval
            },
            onCancel(data:any): void {
                console.log('cancelled')
                // remove created plan in onClick?

                // Show a cancel page, or return to cart
            },
            onError(err:any): void {
                // For example, redirect to a specific error page
                // window.location.href = "/your-error-page-here";
                console.log('erred')
            }
        }).render(this.paypalButton.nativeElement);
    }
}
