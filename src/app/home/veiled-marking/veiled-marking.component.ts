import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DarkModeService } from '../../services/dark-mode.service';

@Component({
    selector: 'app-veiled-marking',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './veiled-marking.component.html',
    styleUrl: './veiled-marking.component.css'
})
export class VeiledMarkingComponent {
    @Input() veiledMarkingIndex!: number;

    constructor(public darkModeService: DarkModeService) {}
}
