import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/user-profile';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isShowing: boolean = false;
  signIn: boolean = false;

  user$: Observable<any>
  currentUser: UserProfile = new UserProfile();

  constructor(private store: Store, private authService: AuthService, private router: Router) {
    this.user$ = this.store.select(state => state.users.users);
  }

  ngOnInit(): void {
    this.user$.subscribe(res => this.currentUser = res[0]);
  }

  showHandler($event){
    this.isShowing = $event;
  }

  authenticated(){
    return this.currentUser ? true : false;
  }

  isAdmin(){
    return this.currentUser.roles.find(role => {
      return role === 'ADMIN'
    }) ? true : false;
  }

  toUsers(){
    this.router.navigate(['users']);
  }

  toAddUser(){
    this.router.navigate(['add-user']);
  }

  logout(){
    this.authService.logOut().subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
