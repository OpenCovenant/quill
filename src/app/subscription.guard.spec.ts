import { TestBed } from '@angular/core/testing';

import { SubscriptionGuard } from './subscription.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SubscriptionGuard', () => {
    let guard: SubscriptionGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule]
        });
        guard = TestBed.inject(SubscriptionGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
