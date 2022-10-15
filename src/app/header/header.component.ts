import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {environment} from "../../environments/environment";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    baseURL!: string;
    getMarkingDetailsCount!: string;
    markingDetailsCount!: number;

    constructor(private http: HttpClient) {
        this.initializeURLs();
        this.http.get(this.getMarkingDetailsCount).subscribe((data: any) => {
            this.markingDetailsCount = data['count'];
        });
    }

    initializeURLs() {
        this.baseURL = environment.baseURL;
        this.getMarkingDetailsCount = this.baseURL + '/api/getMarkingDetailsCount';
    }
}
