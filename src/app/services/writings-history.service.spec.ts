import { TestBed } from '@angular/core/testing';

import { WritingsHistoryService } from './writings-history.service';

describe('WritingsHistoryService', () => {
    let service: WritingsHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WritingsHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
