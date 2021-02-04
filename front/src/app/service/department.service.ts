import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../entity/department';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subdepartment } from '../entity/subdepartment';

const URL_BASE = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]>{
    return this.http.get<Department[]>(URL_BASE + '/departments', {withCredentials: true});
  }

  getSubdepartmentsByDepartments(dep: Department){
    return this.http.post<Subdepartment[]>(URL_BASE + '/subdepartments/findByNameAndDepartment', dep, {withCredentials: true});
  }
}
