import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MarkingDetailsComponent} from "./marking-details/marking-details.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {path: ':id', component: MarkingDetailsComponent},
    {path: '', component: HomeComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
