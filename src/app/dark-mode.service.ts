import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    isDarkMode: boolean = true;

    toggleDarkMode(): void {
        this.isDarkMode = !this.isDarkMode;
    }
}
