import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DarkModeService } from '../../services/dark-mode.service';

@Component({
    selector: 'app-template-markings',
    templateUrl: './template-markings.component.html',
    styleUrl: './template-markings.component.css',
    imports: [CommonModule]
})
export class TemplateMarkingsComponent {
    constructor(public darkModeService: DarkModeService) {}
}
