import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { RoomsComponent } from './rooms/rooms.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DeleteDialogComponent } from './users/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './users/edit-dialog/edit-dialog.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { MoveDialogComponent } from './rooms/move-dialog/move-dialog.component';
import { EditroomDialogComponent } from './rooms/editroom-dialog/editroom-dialog.component';
import { DeleteroomDialogComponent } from './rooms/deleteroom-dialog/deleteroom-dialog.component';
import { FilterComponent } from './rooms/filter/filter.component';

@NgModule({
  declarations: [MainComponent, RoomsComponent, UsersComponent, AddUserComponent, DeleteDialogComponent, EditDialogComponent, AddRoomComponent, MoveDialogComponent, EditroomDialogComponent, DeleteroomDialogComponent, FilterComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    FlexLayoutModule,
    AppMaterialModule
  ]
})
export class MainModule { }
