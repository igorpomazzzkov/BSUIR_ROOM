import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatusHandlerService {

  constructor(private router: Router) { }

  handlerStatus(status: number){
    switch(status){
      case 401: {
        sessionStorage.clear();
        this.router.navigateByUrl('login');
      }
      case 403: {
        this.router.navigateByUrl('404');
      }
    }
  }
}
