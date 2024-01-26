import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
}
