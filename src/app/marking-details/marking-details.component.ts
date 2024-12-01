import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-marking-details',
    templateUrl: './marking-details.component.html',
    styleUrls: ['./marking-details.component.css'],
    imports: [CommonModule]
})
export class MarkingDetailsComponent {
    baseURL!: string;
    getMarkingDetailsURL!: string;

    constructor(
        public darkModeService: DarkModeService,
        private activatedRoute: ActivatedRoute,
        private httpClient: HttpClient
    ) {
        this.initializeURLs();
        this.activatedRoute.paramMap.subscribe((paramMap): void => {
            const id: string | null = paramMap.get('id');

            this.httpClient
                .get(this.getMarkingDetailsURL + '/' + id)
                .subscribe(
                    (html: any) =>
                        (document.getElementById('marking-details')!.innerHTML =
                            html['marking_details_html'])
                );
        });
    }

    private initializeURLs(): void {
        this.baseURL = environment.baseURL;
        this.getMarkingDetailsURL = this.baseURL + '/api/getMarkingDetails';
    }
}
