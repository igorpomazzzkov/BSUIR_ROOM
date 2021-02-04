import {HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private auth: AuthService,
     private  toaster: ToastrService,
     private router: Router,
     private snack: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const re1 = '/assets';
    const re2 = '/auth/logout';
    const re3 = '/auth/login';
    if (request.url.search(re1) === -1
      && request.url.search(re2) === -1
      && request.url.search(re3) === -1
      )
       {
      request = request.clone({
        withCredentials: true
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
            if(err.status == 401){
              // if request is unauthorized
              if(err.headers.get('Message')=='Invalid token'){
                // if token is invalid
                return this.refreshToken(request, next);
              } else {
                // if session is expired
               this.toaster.info('Votre session à étè expirée');
                this.auth.logOut().subscribe(
                  res => console.log(res),
                  err => console.log(err)
                )
               }
            }

            if(err.status == 403){
              this.toaster.clear();
              this.auth.logOut().subscribe(response => {
                console.log(response);
              })
              this.toaster.previousToastMessage = 'Сессия протухла';
            }
            if(err.status === 412){
              console.log(err.error);
              this.toaster.previousToastMessage = err.error;
              this.snack.open(err.error, 'ok', {
                duration: 3000,
              });
            }
      })
    );
  }
  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.refresh().pipe(
      switchMap(
        (res) => {
       return next.handle(this.addAuthorizationHeader(request, res.status));
      },
      )
     );
  }
  private addAuthorizationHeader(request: HttpRequest<any>, res: string): HttpRequest<any> {
    if (res.toString()=='SUCCESS') {
      // if refresh token is valid
      return request.clone({withCredentials: true});
    }
    // if refresh token is invalid
     this.auth.logOut().subscribe(
       res => console.log(res),
       err => console.log(err)
     )
  }

}
