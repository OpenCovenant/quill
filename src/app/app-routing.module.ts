import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkingDetailsComponent } from './marking-details/marking-details.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: 'authentication', component: AuthenticationComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    { path: ':id', component: MarkingDetailsComponent },
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {}
