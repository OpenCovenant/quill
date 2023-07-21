import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class DarkModeService {
    isDarkMode: boolean = false;

    toggleDarkMode() : void {
        this.isDarkMode = !this.isDarkMode;
    }
}
