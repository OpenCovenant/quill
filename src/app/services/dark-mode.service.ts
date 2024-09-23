import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    private readonly DARK_MODE_KEY = 'penda-dark-mode';
    private readonly DARK_MODE_SYSTEM_KEY = 'penda-dark-mode-system';

    isDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)')
        .matches;
    isSystemMode: boolean = false;

    constructor() {
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (this.isSystemMode) {
                    this.isDarkMode = e.matches;
                    this.onDarkModeChange();
                }
            });
    }

    initializeDarkMode(): void {
        const storedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);
        const storedSystemMode = localStorage.getItem(
            this.DARK_MODE_SYSTEM_KEY
        );

        if (storedSystemMode === 'true') {
            this.isSystemMode = true;
            this.isDarkMode = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
        } else if (storedDarkMode) {
            this.isDarkMode = storedDarkMode === 'true';
            this.isSystemMode = false;
        } else {
            this.isSystemMode = true;
            localStorage.setItem(this.DARK_MODE_SYSTEM_KEY, 'true');
        }

        this.onDarkModeChange();
    }

    toggleDarkMode(): void {
        this.isSystemMode = false;
        this.isDarkMode = !this.isDarkMode;
        this.saveThemePreference();
    }

    setSystemMode(): void {
        this.isSystemMode = true;
        localStorage.setItem(this.DARK_MODE_SYSTEM_KEY, 'true');
        localStorage.removeItem(this.DARK_MODE_KEY);

        this.isDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        this.onDarkModeChange();
    }

    setDarkMode(dark: boolean): void {
        this.isSystemMode = false;
        this.isDarkMode = dark;
        this.saveThemePreference();
    }

    private saveThemePreference(): void {
        localStorage.setItem(this.DARK_MODE_KEY, String(this.isDarkMode));
        localStorage.setItem(this.DARK_MODE_SYSTEM_KEY, 'false');
        this.onDarkModeChange();
    }

    private addTransitionClass(): void {
        document
            .querySelectorAll('.dark-mode-slider')
            .forEach((slider) => slider.classList.add('transition-enabled'));
    }

    private onDarkModeChange(): void {
        this.addTransitionClass();
        localStorage.setItem(this.DARK_MODE_KEY, String(this.isDarkMode));
    }
}
