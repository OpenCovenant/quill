import { TestBed } from '@angular/core/testing';

import { SubscriptionGuard } from './subscription.guard';

describe('SubscriptionGuard', () => {
  let guard: SubscriptionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubscriptionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
