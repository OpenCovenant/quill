import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    DARK_MODE_KEY = 'penda-dark-mode';
    isDarkMode: boolean = false;

    initializeDarkMode(): void {
        const alreadySetDarkMode: string | null = localStorage.getItem(
            this.DARK_MODE_KEY
        );
        if (!alreadySetDarkMode) {
            localStorage.setItem(this.DARK_MODE_KEY, 'false');
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
        this.addTransitionClass();
    }

    addTransitionClass(): void {
        document
            .querySelectorAll('.dark-mode-slider')
            .forEach((slider) => slider.classList.add('transition-enabled'));
    }

    onDarkModeChange(): void {
        this.addTransitionClass();
        localStorage.setItem(this.DARK_MODE_KEY, String(this.isDarkMode));
    }
}
