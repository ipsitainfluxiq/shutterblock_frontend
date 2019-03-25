import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-editadmin',
  templateUrl: './editadmin.component.html',
  styleUrls: ['./editadmin.component.css'],
  providers: [Commonservices],
})
export class EditadminComponent implements OnInit {
  public dataForm: FormGroup;
  public es;
  public serverurl;
  public id;

  constructor(es: FormBuilder, private router: Router, private _commonservices: Commonservices, private _http: HttpClient, private route: ActivatedRoute) {
    this.es = es;
    this.serverurl = _commonservices.url;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
      this.getdetails();
    });
    this.dataForm = this.es.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, EditadminComponent.customValidator])],
      password: [''],
      confirmPassword: [''],
      address: ['', Validators.required],
      telephoneno: ['', Validators.required],
      mobileno: ['', Validators.required]
    });
  }

  getdetails(){
    let link = this.serverurl + 'admindetails';
    let data = {_id : this.id};
    this._http.post(link, data)
        .subscribe(res => {
          let result: any;
          result = res;
          console.log(result);
          if (result.status === 'success' && typeof(result.item) !== 'undefined') {
            // console.log(result);
            let userdet = result.item;
            this.dataForm = this.es.group({
              fname: [userdet.firstname, Validators.required],
              lname: [userdet.lastname, Validators.required],
              email: [userdet.email, Validators.compose([Validators.required, EditadminComponent.customValidator])],
              password: [''],
              confirmPassword: [''],
              address: [userdet.address, Validators.required],
              telephoneno: [userdet.telephoneno, Validators.required],
              mobileno: [userdet.mobileno, Validators.required]
            });

          }else {
            this.router.navigate(['/manageadmin']);
          }

        }, error => {
          console.log('Ooops');
        });
  }


  equalToPass(fieldname): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let input = control.value;
      console.log('control.value');
      console.log(control.value);
      console.log(control.root.value[fieldname]);
      let isValid = control.root.value[fieldname] == input;
      console.log('isValid');
      console.log(isValid);
      if (!isValid)
        return {
          equalTo: true
        };
    };
  }

  static customValidator(inputEmail): any {
    console.log('inputEmail');
    console.log(inputEmail);
    if (inputEmail.pristine) {
      return null;
    }
    inputEmail.markAsTouched();
    let filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    console.log(String(inputEmail.value).search(filter) !== -1);
    if (String(inputEmail.value).search(filter) === -1) {
      console.log('valid');
      return {
        invalidEmail: true
      };
    }
  }

  dosubmit(formval) {
    if (this.dataForm.valid) {
      let link = this.serverurl + 'editadmin';
      let data = {
        id: this.id,
        firstname: formval.fname,
        lastname: formval.lname,
        email: formval.email,
        address: formval.address,
        telephoneno: formval.telephoneno,
        mobileno: formval.mobileno
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

}
