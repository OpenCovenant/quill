import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    constructor(private http:HttpClient) {
    }




    ngOnInit(){
        const headers = new HttpHeaders({});
        this.http.get<any>('', {
            headers: headers
        }).subscribe(data=>{
            console.log(data.marking_types['']);
            console.log(data.marking_types['']);
        });

    }
}
