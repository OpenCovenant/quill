import { TestBed } from '@angular/core/testing';

import { DocumentUploadService } from './document-upload.service';

describe('DocumentUploadService', () => {
    let service: DocumentUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DocumentUploadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
