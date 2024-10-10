import { Component } from '@angular/core';
import { DarkModeService } from '../../../services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
    constructor(public darkModeService: DarkModeService) {}
}
