import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor as HttpErrorInterceptor } from './http-error-interceptor.service';

describe('HttpErrorInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpErrorInterceptor = TestBed.get(HttpErrorInterceptor);
    expect(service).toBeTruthy();
  });
});
