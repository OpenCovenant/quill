import { TestBed } from '@angular/core/testing';

import { MarkingTypesLocalStorageService } from './marking-types-local-storage.service';

describe('MarkingsTypeLocalStorageService', () => {
    let service: MarkingTypesLocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MarkingTypesLocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
