import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    isLoading = false;

  constructor(public darkModeService: DarkModeService) { }

}
