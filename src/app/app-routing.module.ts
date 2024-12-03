import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkingDetailsComponent } from './marking-details/marking-details.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authenticationGuard } from './guards/authentication.guard';
import { ProfileComponent } from './profile/profile.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { subscriptionGuard } from './guards/subscription.guard';
import { AboutDocumentUploadComponent } from './about-document-upload/about-document-upload.component'

const routes: Routes = [
    {
        path: 'authentication',
        component: AuthenticationComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'about',
        component: AboutComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authenticationGuard, subscriptionGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'document-upload',
        component: AboutDocumentUploadComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'shortcuts',
        component: ShortcutsComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: 'terms-of-use',
        component: TermsOfUseComponent,
        canActivate: [authenticationGuard]
    },
    {
        path: ':id',
        component: MarkingDetailsComponent,
        canActivate: [authenticationGuard]
    },
    { path: '', component: HomeComponent, canActivate: [authenticationGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
