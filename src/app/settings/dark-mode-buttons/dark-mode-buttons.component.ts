import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
    selector: 'app-dark-mode-buttons',
    standalone: true,
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dark-mode-buttons.component.html',
    styleUrl: './dark-mode-buttons.component.css'
})
export class DarkModeButtonsComponent {
    constructor(public darkModeService: DarkModeService) {}
}
