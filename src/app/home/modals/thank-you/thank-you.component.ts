import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../../services/dark-mode.service';

@Component({
    selector: 'app-thank-you',
    imports: [CommonModule],
    templateUrl: './thank-you.component.html',
    styleUrl: './thank-you.component.css'
})
export class ThankYouComponent {
    constructor(public darkModeService: DarkModeService) {}
}
