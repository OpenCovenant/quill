import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent]
        }).compileComponents();
    });

    // TODO
    // it('should create the app', () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     const app = fixture.componentInstance;
    //     expect(app).toBeTruthy();
    // });

    // TODO
    // it(`should have as title 'Penda'`, () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     const app = fixture.componentInstance;
    //     expect(app.title).toEqual('Penda');
    // });
});
