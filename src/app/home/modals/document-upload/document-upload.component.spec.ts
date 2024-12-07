import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadComponent } from './document-upload.component';
import {
    provideHttpClient,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('DocumentUploadComponent', () => {
    let component: DocumentUploadComponent;
    let fixture: ComponentFixture<DocumentUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DocumentUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
