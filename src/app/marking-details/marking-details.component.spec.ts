import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkingDetailsComponent} from './marking-details.component';

describe('MarkingDetailsComponent', () => {
    let component: MarkingDetailsComponent;
    let fixture: ComponentFixture<MarkingDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MarkingDetailsComponent]
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
