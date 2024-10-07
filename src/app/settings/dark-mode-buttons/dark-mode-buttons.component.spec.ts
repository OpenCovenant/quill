import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkModeButtonsComponent } from './dark-mode-buttons.component';

describe('DarkModeButtonsComponent', () => {
    let component: DarkModeButtonsComponent;
    let fixture: ComponentFixture<DarkModeButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DarkModeButtonsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DarkModeButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
