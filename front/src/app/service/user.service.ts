import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../entity/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const URL_BASE = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router, private store: Store, private http: HttpClient) { }

  getAuthUser(): Observable<User>{
    return this.http.get<User>(URL_BASE + '/profile/me', { withCredentials: true });
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(URL_BASE + '/profile/users', { withCredentials: true });
  }

  registerUser(user: User): Observable<any>{
    return this.http.post(URL_BASE + '/profile/register', user, {responseType: 'text' as 'json', withCredentials: true})
  }

  deleteUser(user: User){
    return this.http.delete(URL_BASE + '/profile/delete', {params: {'username': user.username}});
  }

  editUser(user: User){
    return this.http.put(URL_BASE + '/profile/edit', user, {withCredentials: true});
  }
}
