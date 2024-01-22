import { TestBed } from '@angular/core/testing';

import { AuthenticationInterceptorInterceptor } from './authentication-interceptor.interceptor';

describe('AuthenticationInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticationInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthenticationInterceptorInterceptor = TestBed.inject(AuthenticationInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
