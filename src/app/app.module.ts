import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

@NgModule({
    declarations: [
        AppComponent,
        MarkingDetailsComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        SettingsComponent,
        AboutComponent,
        ShortcutsComponent,
        AuthenticationComponent
    ],
    imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
