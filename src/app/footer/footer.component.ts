import { Component } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    imports: [CommonModule]
})
export class FooterComponent {
    constructor(public darkModeService: DarkModeService) {}
}
