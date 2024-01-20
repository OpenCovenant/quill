import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkingDetailsComponent } from './marking-details/marking-details.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationGuard } from './authentication.guard'
import { ProfileComponent } from './profile/profile.component'

const routes: Routes = [
    { path: 'authentication', component: AuthenticationComponent, canActivate: [AuthenticationGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
    { path: 'settings', component: SettingsComponent },
    { path: 'shortcuts', component: ShortcutsComponent },
    { path: ':id', component: MarkingDetailsComponent },
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
