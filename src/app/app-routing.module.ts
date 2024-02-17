import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkingDetailsComponent } from './marking-details/marking-details.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationGuard } from './authentication.guard';
import { ProfileComponent } from './profile/profile.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SubscriptionGuard } from './subscription.guard';

const routes: Routes = [
    {
        path: 'authentication',
        component: AuthenticationComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthenticationGuard, SubscriptionGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'shortcuts',
        component: ShortcutsComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'terms-of-use',
        component: TermsOfUseComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: ':id',
        component: MarkingDetailsComponent,
        canActivate: [AuthenticationGuard]
    },
    { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
