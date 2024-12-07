import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfUseComponent } from './terms-of-use.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('TermsOfUseComponent', () => {
    let component: TermsOfUseComponent;
    let fixture: ComponentFixture<TermsOfUseComponent>;

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
        fixture = TestBed.createComponent(TermsOfUseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
