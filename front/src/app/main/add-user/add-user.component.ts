import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../entity/user';
import { UserService } from '../../service/user.service';
import { Role } from 'src/app/entity/role';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from '../../model/login-response';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;

  user: User;
  roles = Role;
  roleOption = [];
  role: Role;

  loginError:boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private snack: MatSnackBar) {
    this.userForm = this.formBuilder.group({
      'lastName': ['', [Validators.required]],
      'firstName': ['', [Validators.required]],
      'middleName': ['', [Validators.required]],
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'role': ['USER', [Validators.required]]
    });
    this.roleOption = Object.keys(this.roles);
  }

  ngOnInit(): void {

  }

  getMessageError(){
    return this.toastr.previousToastMessage;
  }

  addUser(){
    if(!this.userForm.invalid){
      this.user = this.userForm.value;
      this.user.roles = new Array;
      console.log(this.role);
      this.user.roles.push(this.role);
      let response: LoginResponse = new LoginResponse();
      this.userService.registerUser(this.user).subscribe(res => {
        res = response;
        console.log(response.error);
      }, (err) => {
        this.loginError = true;
        console.log("ERROR")
      },
        () => {
        this.toastr.previousToastMessage = '';
        const snackBarRef = this.snack.open('Пользователь успешно добавлен', 'Пользователи', {duration: 5000});
        snackBarRef.afterDismissed().subscribe(info => {
          this.router.navigate(['users']);
        })
      });
    }
  }
}
