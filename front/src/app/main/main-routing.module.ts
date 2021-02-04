import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { AdminGuard } from '../guard/admin.guard';
import { RoomsComponent } from './rooms/rooms.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddRoomComponent } from './add-room/add-room.component';

const routes: Routes = [
  { path: '', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'add-room', component: AddRoomComponent, canActivate: [AuthGuard]},
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'add-user', component: AddUserComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
