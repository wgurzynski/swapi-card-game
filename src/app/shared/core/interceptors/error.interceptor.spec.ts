import { TestBed } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';
import { MatSnackBar } from "@angular/material/snack-bar";

describe('ErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorInterceptor,
      MatSnackBar
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
