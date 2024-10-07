import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
    selector: 'app-dark-mode-buttons',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dark-mode-buttons.component.html',
    styleUrl: './dark-mode-buttons.component.css'
})
export class DarkModeButtonsComponent {
    constructor(public darkModeService: DarkModeService) {}
}
