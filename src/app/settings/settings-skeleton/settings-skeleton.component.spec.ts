import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSkeletonComponent } from './settings-skeleton.component';

describe('SettingsSkeletonComponent', () => {
    let component: SettingsSkeletonComponent;
    let fixture: ComponentFixture<SettingsSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SettingsSkeletonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsSkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
