import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('TermsAndConditionsComponent', () => {
    let component: TermsAndConditionsComponent;
    let fixture: ComponentFixture<TermsAndConditionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TermsAndConditionsComponent],
            imports: [HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TermsAndConditionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
