import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
  providers: [Commonservices]
})
export class MyaccountComponent implements OnInit {
  public dataForm: FormGroup;
  public passwordForm: FormGroup;
  public kl;
  public serverurl;
  public id;
  public userid;
  public passworderrormsg: any = '';
  public showpasswordmodal: any = false;
  public showsucesspasswordmodal: any = false;

  constructor(kl: FormBuilder, private router: Router, private _commonservices: Commonservices, private _http: HttpClient, private route: ActivatedRoute, private cookeiservice: CookieService) {
    this.kl = kl;
    this.serverurl = _commonservices.url;
    this.userid = this.cookeiservice.get('userid');
    console.log('this.userid');
    console.log(this.userid);
    this.accountdetails();
  }

  ngOnInit() {
    this.dataForm = this.kl.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required])],
      address: ['', Validators.required],
      telephoneno: ['', Validators.required],
      mobileno: ['', Validators.required]
    });
    this.passwordForm = this.kl.group({

      old_password: ['', Validators.required],
      _id: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.compose([Validators.required,
        this.equalToPass('password')
      ])],
    });
  }

  equalToPass(fieldname): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const input = control.value;
      console.log('control.value');
      console.log(control.value);
      console.log(control.root.value[fieldname]);
      const isValid = control.root.value[fieldname] === input;
      console.log('isValid');
      console.log(isValid);
      if (!isValid) {
        return {
          equalTo: true
        };
      }
    };
  }

  accountdetails() {
    let link = this.serverurl + 'userdetails';
    let data = {_id: this.userid};
    console.log('data');
    console.log(data);
    this._http.post(link, data)
        .subscribe(res => {
          let result: any;
          result = res;
          console.log(result);
          if (result.status == 'success' && typeof result.item != 'undefined') {
            let userdet = result.item;
            this.dataForm = this.kl.group({
              fname: [userdet.firstname, Validators.required],
              lname: [userdet.lastname, Validators.required],
              email: [userdet.email, Validators.compose([Validators.required])],
              address: [userdet.address, Validators.required],
              telephoneno: [userdet.telephoneno, Validators.required],
              mobileno: [userdet.phoneno, Validators.required]
            });
          } else {
            console.log('error in userdetails');
            this.router.navigate(['/admindashboard']);
          }

        }, error => {
          console.log('Ooops');
        });
  }



  dosubmit(formval) {
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();

    }
    console.log('this.dataForm.valid');
    console.log(this.dataForm.valid);
    if (this.dataForm.valid) {
      let link = this.serverurl + 'editadmin';
      let data = {
        id: this.userid,
        firstname: formval.fname,
        lastname: formval.lname,
        email: formval.email,
        address: formval.address,
        telephoneno: formval.telephoneno,
        phoneno: formval.mobileno,
      };
      console.log(this.dataForm.valid);
      console.log(data);
      this._http.post(link, data)
          .subscribe(data => {
            this.router.navigate(['/manageadmin']);
          }, error => {
            console.log('Oooops!');
          });
    }

  }

  showPasswordModal(){

    this.showpasswordmodal = true;
  }

  passwordSubmit(formval) {

    for (let i in this.passwordForm.controls) {
      this.passwordForm.controls[i].markAsTouched();
      /*console.log(this.passwordForm.value);
       console.log(this.passwordForm.controls[i].valid);*/
    }

    /* console.log('this.passwordForm.valid');
     console.log(this.passwordForm.valid);*/
    let link = this.serverurl + 'changepassword';

    let data = {

      old_password: formval.old_password,
      password: formval.password,
      _id: this.userid

    };
    this._http.post(link , data)
        .subscribe(res => {

          let result: any = {};
          result = res;
          console.log(result);
          console.log(result.msg);
          this.passworderrormsg = result.msg;
          console.log('this.passworderrormsg');
          console.log(this.passworderrormsg);
          if ( result.status == 'success') {

            setTimeout(() => {
              this.showSuccessPasswordModal();
            }, 3000);
          }
        });
  }
  showSuccessPasswordModal() {
    this.showsucesspasswordmodal = true;
  }
  onHidden() {

    this.showpasswordmodal = false;
    this.showsucesspasswordmodal = false;
  }

}
