import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../entity/user';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { LoginRequst } from 'src/app/model/login-request';
import { LoginResponse } from 'src/app/model/login-response';
import { UserProfile } from 'src/app/model/user-profile';
import { AddUser } from 'src/app/model/action';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;

  credentials = {username: '', password: ''};

  loginError:boolean = true;

  usernames: string[];

  constructor(
    private authServive: AuthService,
    private toastr: ToastrService,
    private formBuilder:FormBuilder,
    private store: Store,
    private router: Router) {
      this.loginForm = this.formBuilder.group({
        'password': ['', [Validators.required]],
        'username': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authServive.getUsernames().subscribe(response => {
      this.usernames = response;
    })
  }

  getMessageError(){
    return this.toastr.previousToastMessage;;
  }

  login():void {
    if(!this.loginForm.invalid){
      this.getMessageError();
      let request: LoginRequst = new LoginRequst();
    request.username = this.loginForm.get('username').value;
    request.password = this.loginForm.get('password').value;

    let response: LoginResponse = new LoginResponse();
    let profile: UserProfile = new UserProfile();

    this.authServive.signIn(request).subscribe(res => {
      response = res;
    } , (err) => {
      this.loginError = true;
    }, () => {
      if(response.error == 'User Already logged in'){
        this.toastr.error( 'User Already logged in');
      } else if(response.status == 'SUCCESS'){
        this.loginError = false;
        this.authServive.getUser().subscribe(res => profile = res, err => console.log(err), () => {
          this.store.dispatch(new AddUser(profile));
          this.router.navigate(['/rooms']);
          this.toastr.previousToastMessage = '';
        });
      } else {
        this.toastr.error('Invalid credentials');
      }
    });
    }
    this.toastr.previousToastMessage = '';
    this.loginError = true;
  }
}
