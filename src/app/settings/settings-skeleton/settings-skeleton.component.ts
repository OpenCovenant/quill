import { Component } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-settings-skeleton',
    imports: [NgClass],
    templateUrl: './settings-skeleton.component.html',
    styleUrl: './settings-skeleton.component.css'
})
export class SettingsSkeletonComponent {
    constructor(public darkModeService: DarkModeService) {}
}
