import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    baseURL!: string;
    getMarkingTypes!: string;
    getMarkingTypesCount!: string;
    markingTypesCount: number = 0;
    markingTypes: any = {};
    markingTypeKeys: Array<string> = [];

    constructor(private http: HttpClient) {
        this.initializeURLs();
        this.http.get(this.getMarkingTypesCount).subscribe((data: any) => {
            this.markingTypesCount = data['count'];
        });
        this.http.get(this.getMarkingTypes).subscribe((data: any) => {
            this.markingTypes = data['marking_types'];
            this.markingTypeKeys = Object.keys(this.markingTypes);
        });
    }

    initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getMarkingTypes = `${this.baseURL}/api/getMarkingTypes`;
        this.getMarkingTypesCount = `${this.baseURL}/api/getMarkingTypesCount`;
    }

    closeOffcanvas() {
        document.getElementById('offcanvasCloseButton')!.click();
    }
}
