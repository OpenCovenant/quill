import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateMarkingsComponent } from './template-markings.component';

describe('TemplateMarkingsComponent', () => {
    let component: TemplateMarkingsComponent;
    let fixture: ComponentFixture<TemplateMarkingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TemplateMarkingsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TemplateMarkingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
