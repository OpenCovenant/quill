import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    DARK_MODE_KEY = 'penda-dark-mode';
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    constructor() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.onDarkModeChange()
        });
    }
    initializeDarkMode(): void {
        const alreadySetDarkMode: string | null = localStorage.getItem(
            this.DARK_MODE_KEY
        );

        if (!alreadySetDarkMode) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode = systemTheme;
            localStorage.setItem(this.DARK_MODE_KEY, String(systemTheme));
            // this.isDarkMode = false;
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

