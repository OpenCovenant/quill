import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DarkModeService } from '../../services/dark-mode.service';

@Component({
    selector: 'app-loading-marking',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-marking.component.html',
    styleUrl: './loading-marking.component.css'
})
export class LoadingMarkingComponent {
    constructor(public darkModeService: DarkModeService) {}
}
