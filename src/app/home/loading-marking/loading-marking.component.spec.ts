import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMarkingComponent } from './loading-marking.component';

describe('LoadingMarkingComponent', () => {
    let component: LoadingMarkingComponent;
    let fixture: ComponentFixture<LoadingMarkingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingMarkingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingMarkingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
