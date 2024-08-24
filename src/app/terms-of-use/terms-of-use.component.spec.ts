import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfUseComponent } from './terms-of-use.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TermsOfUseComponent', () => {
    let component: TermsOfUseComponent;
    let fixture: ComponentFixture<TermsOfUseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [TermsOfUseComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
