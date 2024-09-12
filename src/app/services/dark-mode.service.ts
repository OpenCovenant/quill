import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    DARK_MODE_KEY = 'penda-dark-mode';
    DARK_MODE_SYSTEM_KEY = 'penda-dark-mode-system';
    //is dark mode kerkon te shikoje nqs eshte true ose false pra nqs color scheme is darkmode = true else false
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

        //if store system is set to true
        if (storedSystemMode === 'true') {
            //set issytem mode to true
            this.isSystemMode = true;
            //we set darkmode based on system theme mode
            this.isDarkMode = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
        } else if (storedDarkMode) {
            // nqs dark storedark mode ne localstorage is true vendosim system mode to false
            //also we set darkmode based on value of storedarkmode this one is darkmode
            this.isDarkMode = storedDarkMode === 'true';
            this.isSystemMode = false;
        } else {
            //here we set system mode to true as default
            this.isSystemMode = true;
            //and save the dark mode system key to local storage
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

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;
        this.isDarkMode = prefersDark;

        this.onDarkModeChange();
    }

    setDarkMode(dark: boolean): void {
        this.isSystemMode = false;
        this.isDarkMode = dark;
        this.saveThemePreference();
    }

    saveThemePreference(): void {
        localStorage.setItem(this.DARK_MODE_KEY, String(this.isDarkMode));
        localStorage.setItem(this.DARK_MODE_SYSTEM_KEY, 'false');
        this.onDarkModeChange();
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
