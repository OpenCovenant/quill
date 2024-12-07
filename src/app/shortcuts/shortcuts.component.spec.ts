import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutsComponent } from './shortcuts.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ShortcutsComponent', () => {
    let component: ShortcutsComponent;
    let fixture: ComponentFixture<ShortcutsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShortcutsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
