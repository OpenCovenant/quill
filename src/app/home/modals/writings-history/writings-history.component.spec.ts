import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingsHistoryComponent } from './writings-history.component';

// TODO
xdescribe('WritingsHistoryComponent', () => {
    let component: WritingsHistoryComponent;
    let fixture: ComponentFixture<WritingsHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WritingsHistoryComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(WritingsHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
