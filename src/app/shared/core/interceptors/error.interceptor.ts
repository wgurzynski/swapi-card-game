import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, Observable } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppStateService } from "../../services/app-state/app-state.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar, private appStateService: AppStateService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        }
        else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        this.snackBar.open(errorMsg);
        this.appStateService.stopLoading();

        return EMPTY;
      })
    )
  }
}
