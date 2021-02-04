import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/user-profile';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit{

  user$: Observable<any>
  currentUser: UserProfile = new UserProfile();

  constructor(private store: Store, private authService: AuthService) {
    this.user$ = this.store.select(state => state.users.users);
  }

  ngOnInit(): void {
    this.user$.subscribe(res => this.currentUser = res[0]);
  }

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  @Input()
  isShowing: boolean = false;

  @Output()
  showing: EventEmitter<boolean> = new EventEmitter();

  closeSidenav(){
    this.showing.emit(!this.isShowing);
    this.sidenav.close();
  }

  authenticated(){
    return this.currentUser ? true : false;
  }

  logout(){
    this.authService.logOut().subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
