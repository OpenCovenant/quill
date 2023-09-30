import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    DARK_MODE = 'penda-dark-mode';
    isDarkMode: boolean = false;

    initializeDarkMode(): void {
        const alreadySetDarkMode: string | null = localStorage.getItem(
            this.DARK_MODE
        );
        if (!alreadySetDarkMode) {
            localStorage.setItem(this.DARK_MODE, 'false');
            this.isDarkMode = false;
        } else {
            if (alreadySetDarkMode === 'false') {
                this.isDarkMode = false;
            }

            if (alreadySetDarkMode === 'true') {
                this.isDarkMode = true;
            }
        }
    }

    toggleDarkMode(): void {
        this.isDarkMode = !this.isDarkMode;
        const styleTag = document.createElement('style');
        styleTag.append(this.DARK_MODE)
        document.body.append(styleTag);
    }

    onDarkModeChange(): void {
        localStorage.setItem(this.DARK_MODE, String(this.isDarkMode));
    }
}
