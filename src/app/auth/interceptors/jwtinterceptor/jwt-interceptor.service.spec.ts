import { TestBed } from '@angular/core/testing';

import { JwtInterceptor as JwtInterceptor } from './jwt-interceptor.service';

describe('JwtInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtInterceptor = TestBed.get(JwtInterceptor);
    expect(service).toBeTruthy();
  });
});
