import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {AppComponent} from './app.component';
import {MarkingDetailsComponent} from './marking-details/marking-details.component';
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {HomeComponent} from './home/home.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {SocialAuthServiceConfig, SocialAuthService, FacebookLoginProvider,GoogleLoginProvider,SocialLoginModule} from '@abacritt/angularx-social-login';

@NgModule({
    declarations: [
        AppComponent,
        MarkingDetailsComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        AuthenticationComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        SocialLoginModule
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin:false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                          'yourId'
                        )
                      },
                    {
                    id: FacebookLoginProvider.PROVIDER_ID,
                    provider: new FacebookLoginProvider('yourId'),
                    }
                ],
                onError:(err) => {
                    console.log(err);
                },
            } as SocialAuthServiceConfig,
        },
        SocialAuthService,
    ],
      bootstrap: [AppComponent],
    })
    export class AppModule {
}
