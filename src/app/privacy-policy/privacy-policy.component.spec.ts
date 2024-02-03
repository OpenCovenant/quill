import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('PrivacyPolicyComponent', () => {
    let component: PrivacyPolicyComponent;
    let fixture: ComponentFixture<PrivacyPolicyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrivacyPolicyComponent], imports:[ HttpClientTestingModule, RouterTestingModule]
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
