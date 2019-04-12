import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
// import { tokenNotExpired } from 'angular2-jwt';
// import { LoggedinService } from './loggedin.service';
// import { BusyService } from '../busy.service';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              public http: HttpClient,
              private _apiService: ApiService,
              private cookieService: CookieService
              // private loggedinService: LoggedinService
  ) {}


  canActivate() {

    console.log('in auth guard');
    console.log(this.cookieService.get('jwttoken'));
    if (this.cookieService.get('jwttoken') == null || this.cookieService.get('jwttoken').length < 10) {
      // alert(7);
      this.router.navigate(['/']);
    } else return true;






    /*
    private loggedinService: LoggedinService,
     if (tokenNotExpired()) {


       this.loggedinService.announceLoggedin(true);
       return true;
     }
     */
    //this.loggedinService.announceLoggedin(false);
    //localStorage.removeItem('id_token');
    //this.router.navigate(['/login']);
    return false;
  }
}
