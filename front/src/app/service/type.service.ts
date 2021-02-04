import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Room } from '../entity/room';
import { Type } from '../entity/type';

const URL_BASE = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private router: Router, private store: Store, private http: HttpClient) { }

  getTypes(): Observable<Type[]>{
    return this.http.get<Type[]>(URL_BASE + '/types', {withCredentials: true});
  }
}
