import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../entity/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {Observable} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['position', 'lastName', 'firstName', 'middleName', 'username', 'roles', 'edit', 'remove'];
  dataSource: MatTableDataSource<User>;
  user: User;
  currentUser: User;
  users: User[];
  user$: Observable<any>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private userService: UserService,private store: Store, private dialog: MatDialog, private router: Router) {
    this.user$ = this.store.select(state => state.users.users);
    this.userService.getAllUsers().subscribe(response => {
      this.users = response;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    });
  }

  ngOnInit(): void {
    this.user$.subscribe(res => this.currentUser = res[0]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogDelete(user: User): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        const index = this.users.indexOf(result);
        const newUser = [
          ...this.users.splice(0, index),
          ...this.users.splice(index + 1)
        ];
        this.dataSource = new MatTableDataSource(newUser);
      }
    });
  }

  openDialogEdit(user: User){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '70%',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        const index = this.users.indexOf(user);
        this.users[index] = result;
        this.dataSource = new MatTableDataSource(this.users);
      }
    });
  }

  removeUser(user: User){
    this.openDialogDelete(user);
  }

  editUser(user: User){
    this.openDialogEdit(user);
  }

  toAddUser(){
    this.router.navigate(['add-user']);
  }

  checkUser(user: User){
    return user.username != this.currentUser.username;
  }
}
