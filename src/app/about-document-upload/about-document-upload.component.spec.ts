import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDocumentUploadComponent } from './about-document-upload.component';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AboutDocumentUploadComponent', () => {
    let component: AboutDocumentUploadComponent;
    let fixture: ComponentFixture<AboutDocumentUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AboutDocumentUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
