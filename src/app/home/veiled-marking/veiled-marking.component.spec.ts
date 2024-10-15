import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiledMarkingComponent } from './veiled-marking.component';

describe('VeiledMarkingComponent', () => {
    let component: VeiledMarkingComponent;
    let fixture: ComponentFixture<VeiledMarkingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VeiledMarkingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VeiledMarkingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
