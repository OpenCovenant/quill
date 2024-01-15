import { TestBed } from '@angular/core/testing';

import { DissmisMarkingStorageService } from './dismiss-marking-storage.service';

describe('DissmisMarkingStorageService', () => {
  let service: DissmisMarkingStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DissmisMarkingStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
