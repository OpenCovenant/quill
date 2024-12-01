import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
