import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';

import { AppComponent } from './app.component';
import { MarkingDetailsComponent } from './marking-details/marking-details.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ProfileComponent } from './profile/profile.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { AboutDocumentUploadComponent } from './about-document-upload/about-document-upload.component'

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SettingsComponent,
        AboutComponent,
        HeaderComponent,
        FooterComponent,
        MarkingDetailsComponent,
        ProfileComponent,
        HomeComponent,
        TermsOfUseComponent,
        ShortcutsComponent,
        AuthenticationComponent,
        PrivacyPolicyComponent,
        DashboardComponent,
        AboutDocumentUploadComponent,
        CheckoutComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {}
