import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';

describe('PrivacyPolicyComponent', () => {
    let component: PrivacyPolicyComponent;
    let fixture: ComponentFixture<PrivacyPolicyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrivacyPolicyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
