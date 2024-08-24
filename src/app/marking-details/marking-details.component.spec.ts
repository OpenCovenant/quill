import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingDetailsComponent } from './marking-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';

describe('MarkingDetailsComponent', () => {
    let component: MarkingDetailsComponent;
    let fixture: ComponentFixture<MarkingDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MarkingDetailsComponent],
            imports: [RouterTestingModule],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
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
