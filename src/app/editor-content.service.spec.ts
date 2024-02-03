import { TestBed } from '@angular/core/testing';

import { EditorContentService } from './editor-content.service';

describe('EditorContentService', () => {
  let service: EditorContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
