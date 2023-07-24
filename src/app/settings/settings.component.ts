import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    results: any;
    markingTypes: any[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.getApiResponse();
    }

    getApiResponse() {
        this.http
            .get<any>(
                // API Link
                '[URL]'
            )
            .subscribe((response) => {
                this.results = response;
                this.markingTypes = Object.values(this.results.marking_types);
                for (const markingType in this.results.marking_types) {
                    if (
                        this.results.marking_types.hasOwnProperty(markingType)
                    ) {
                        this.results.marking_types[markingType].description;
                        this.results.marking_types[markingType].enabled;
                    }
                }
            });
    }
}
