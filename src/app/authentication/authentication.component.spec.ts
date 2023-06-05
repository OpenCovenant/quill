import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationComponent } from './authentication.component';

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthenticationComponent],
            imports: [RouterTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(AuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
