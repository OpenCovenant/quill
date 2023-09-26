import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { DarkModeService } from '../dark-mode.service';

@Component({
    selector: 'app-marking-details',
    templateUrl: './marking-details.component.html',
    styleUrls: ['./marking-details.component.css']
})
export class MarkingDetailsComponent {
    baseURL!: string;
    getMarkingDetailsURL!: string;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        public darkModeService: DarkModeService
    ) {
        this.initializeURLs();
        this.route.paramMap.subscribe((paramMap) => {
            const id = paramMap.get('id');

            this.http
                .get(this.getMarkingDetailsURL + '/' + id)
                .subscribe(
                    (html: any) =>
                        (document.getElementById('marking-details')!.innerHTML =
                            html['marking_details_html'])
                );
        });
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getMarkingDetailsURL = this.baseURL + '/api/getMarkingDetails';
    }
}
