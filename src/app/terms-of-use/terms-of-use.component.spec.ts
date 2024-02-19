import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfUseComponent } from './terms-of-use.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TermsOfUseComponent', () => {
    let component: TermsOfUseComponent;
    let fixture: ComponentFixture<TermsOfUseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TermsOfUseComponent],
            imports: [HttpClientTestingModule]
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
