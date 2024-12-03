import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDocumentUploadComponent } from './about-document-upload.component';

describe('AboutDocumentUploadComponent', () => {
  let component: AboutDocumentUploadComponent;
  let fixture: ComponentFixture<AboutDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDocumentUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
