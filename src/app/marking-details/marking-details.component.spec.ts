import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingDetailsComponent } from './marking-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('MarkingDetailsComponent', () => {
    let component: MarkingDetailsComponent;
    let fixture: ComponentFixture<MarkingDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MarkingDetailsComponent],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkingDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
