import { TestBed } from '@angular/core/testing';

import { WrittenTextsLocalStorageService } from './written-texts-local-storage.service';

describe('LocalStorageService', () => {
    let service: WrittenTextsLocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WrittenTextsLocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
