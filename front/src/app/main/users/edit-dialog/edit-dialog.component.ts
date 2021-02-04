import { Component, OnInit, Inject } from '@angular/core';
import { User } from './../../../entity/user';
import { Role } from './../../../entity/role';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  user: User;
  editForm: FormGroup;
  roles = Role;
  roleOption = [];
  role: Role;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    private userService: UserService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: User) {
    this.user = data;
    this.editForm = this.formBuilder.group({
      'lastName': [this.user.lastName, [Validators.required]],
      'firstName': [this.user.firstName,  [Validators.required]],
      'middleName': [this.user.middleName,  [Validators.required]],
      'username': [this.user.username,  [Validators.required]],
      'password': [''],
      'role': [Validators.required]
    });
    this.roleOption = Object.keys(this.roles);
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editUser(){
    if(!this.editForm.invalid){
      let id = this.user.id;
      this.user = this.editForm.value;
      this.user.id = id;
      this.user.roles = new Array;
      this.user.roles.push(this.role);
      this.userService.editUser(this.user).subscribe(response => {
        this.dialogRef.close(this.user);
      });
    }
  }

}
