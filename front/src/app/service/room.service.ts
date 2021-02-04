import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Room } from '../entity/room';

const URL_BASE = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class RoomService {

  constructor(private router: Router, private store: Store, private http: HttpClient) { }

  getAllRooms(): Observable<Room[]>{
    return this.http.get<Room[]>(URL_BASE + '/rooms', {withCredentials: true});
  }

  addRoom(room: Room): Observable<Room>{
    return this.http.post<Room>(URL_BASE + '/rooms/add' , room, {withCredentials: true});
  }

  deleteRoom(room: Room){
    return this.http.delete(URL_BASE + '/rooms/delete', {withCredentials: true, params: {'id': room.id.toString()}});
  }

  moveRoom(room: Room){
    return this.http.put<Room>(URL_BASE + '/rooms/move', room, {withCredentials: true});
  }

  editRoom(room: Room){
    return this.http.put<Room>(URL_BASE + '/rooms/edit', room, {withCredentials: true});
  }

  searchRoom(room: Room){
    return this.http.post<Room[]>(URL_BASE + '/rooms/search', room, {withCredentials: true});
  }
}
