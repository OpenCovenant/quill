import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutsComponent } from './shortcuts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('ShortcutsComponent', () => {
  let component: ShortcutsComponent;
  let fixture: ComponentFixture<ShortcutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortcutsComponent ],
        imports: [HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
