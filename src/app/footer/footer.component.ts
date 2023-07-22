import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    constructor(public darkModeService: DarkModeService) {}
}
