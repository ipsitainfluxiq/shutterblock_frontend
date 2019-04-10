import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ApiService} from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [Commonservices]
})
export class LoginComponent implements OnInit {
  public dataForm: FormGroup;
  public kp;
  public loginurl;
  public endpoint = 'login';
  public serverurl;
  public errormg: any = '';

  constructor(kp: FormBuilder, private router: Router, private _commonservices: Commonservices, public apiService: ApiService, private _http: HttpClient, private cookeiservice: CookieService) {
    this.kp = kp;
    this.serverurl = _commonservices.url;
this.loginurl = this.apiService.loginurl;
console.log('this.loginurl');
console.log(this.loginurl);
  }

  ngOnInit() {
    this.dataForm = this.kp.group({
      phone: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });

  }

  static customValidator(inputemail): any {
    console.log('inputemail');
    console.log(inputemail);
    if (inputemail.pristine) {
      return null;
    }
    inputemail.markAsTouched();
    const filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    console.log(String(inputemail.value).search(filter) !== -1);
    if (String(inputemail.value).search(filter) === -1) {
      console.log('valid');
      return {
        invalidemail: true

      };
    }

  }

  dosubmit(formval) {
    this.errormg = '';
    console.log(formval.phone);
    console.log(formval.password);
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
      console.log(this.dataForm.controls[x].valid);
    }
    if (this.dataForm.valid) {
      // const link = this.serverurl + 'login';
      const link = this.serverurl + 'userlogin';

      const data = {
        phone: formval.phone,
        password: formval.password,

      };
      this.apiService.postDatawithottoken(this.endpoint, data)
      // this._http.post(link, data)
          .subscribe(res => {
            let result: any = {};
            result = res;
            console.log('result....');
            console.log(result);
            if (result.status == 'error') {
              this.errormg = result.msg;
            }
            if (result.status == 'success') {

              this.cookeiservice.set('userid', result.item[0]._id);
              console.log('_id');
              this.cookeiservice.set('phone', result.item[0].phone);
              this.cookeiservice.set('type', result.item[0].type);
              this.cookeiservice.set('fullname', result.item[0].firstname + ' ' + result.item[0].lastname);
              // this.cookeiservice.set('jwttoken', result.token);

              if (result.item.length > 0 && result.status == 'success' ) {

                if (result.item[0].type == 'admin') {
                 this.router.navigate(['/dashboard']);
                 }
                if (result.item[0].type == 'user') {
                  /*this.router.navigate(['/offerpage']);*/
                }
                console.log('in success ...');

              }
              else{
                if(result.item.length > 0 && result.item[0].status == 0)
                  this.errormg = 'Your account is inactive , contact support !!';
                if(result.item.length == 0 )
                  this.errormg = 'Your Phone and Password number does not match !!';

                //this.errormg = result.msg;
                console.log('in error ...');
              }

              if (result.item[0].type === 'admin') {
                this.router.navigate(['/dashboard']);
              }
              else {
                console.log('in error.....');
                console.log(result.item[0].type);

              }



            }
          }, error => {
            console.log('Oooops!');
          });
    }
  }
}
