import { Component } from '@angular/core';
import { DarkModeService } from './dark-mode.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = 'Penda';

    constructor(public darkModeService: DarkModeService) {}
}
