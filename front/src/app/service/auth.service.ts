import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequst } from '../model/login-request';
import { LoginResponse } from '../model/login-response';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Reset } from '../model/action';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../entity/user';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

const URL_BASE = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private router: Router, private store: Store, private http: HttpClient) { }

  signIn(request: LoginRequst): Observable<any> {
    const headers = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(URL_BASE + '/auth/login', request, { headers: headers, responseType: 'json', withCredentials: true})
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          console.log(error);
          return error;
        })
      );
  }

  register(user: User){
    const headers = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(URL_BASE + '/auth/registration', user, { headers: headers, responseType: 'json', withCredentials: true});
  }

  refresh(): Observable<any>{
    return this.http.get<any>(URL_BASE + '/profile', { withCredentials: true });
  }

  getUsernames(): Observable<string[]>{
    return this.http.get<string[]>(URL_BASE + '/auth/usernames', { withCredentials: true})
  }

  getUser(): Observable<any>{
    return this.http.get<any>(URL_BASE + '/profile', { withCredentials: true})
      .pipe(
        tap(user => {
          console.log(user);
        })
      );
  }

  logOut(): Observable<any>{
    return this.http.get(URL_BASE + '/auth/logout', { withCredentials: true})
      .pipe(tap(res => {
        console.log(res);
        this.store.dispatch(new Reset());
        localStorage.clear();
        this.router.navigate(['login']);
      }));
  }
}
