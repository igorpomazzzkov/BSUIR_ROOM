import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../../../entity/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  user: User;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User) {
    this.user = data;
  }

  ngOnInit(){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteUser(){
    this.userService.deleteUser(this.user).subscribe(response => {
      this.dialogRef.close(this.user);
    });
  }
}
