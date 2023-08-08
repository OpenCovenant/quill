import { Component, OnInit } from '@angular/core';
import { MarkingTypesLocalStorageService } from '../local-storage/marking-types-local-storage.service'

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    markingTypes: any[] = [];

    constructor(private markingTypesLocalStorageService: MarkingTypesLocalStorageService) {}

    ngOnInit(): void {
        this.markingTypesLocalStorageService.initializeMarkingTypes();
    }

    onMarkingTypeSelection(markingTypeID: string, selected: boolean): void {
        localStorage.setItem(markingTypeID, String(selected));
    }

}
