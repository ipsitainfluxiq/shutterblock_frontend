import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-addadmin',
  templateUrl: './addadmin.component.html',
  styleUrls: ['./addadmin.component.css'],
  providers: [Commonservices]
})
export class AddadminComponent implements OnInit {

  public dataForm: FormGroup;
  public es;
  public serverurl;
  public datalist: any = [];

  constructor(es: FormBuilder, private router: Router, private _commonservices: Commonservices, private _http: HttpClient) {
    this.es = es;
    this.serverurl = _commonservices.url;
  }

  ngOnInit() {
    this.dataForm = this.es.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, AddadminComponent.customValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])], //password 'blank', composing means 1 or more validation create for..
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15),
        this.equalToPass('password')
      ])],
      address: ['', Validators.required],
      telephoneno: ['', Validators.required],
      mobileno: ['', Validators.required]
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
    const filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    console.log(String(inputEmail.value).search(filter) !== -1);
    if (String(inputEmail.value).search(filter) === -1) {
      console.log('valid');
      return {
        invalidEmail: true
      };
    }
  }

  adminsubmit(formval) {
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
      /*console.log('this.dataForm.controls[x].valid');
       console.log(this.dataForm.controls[x]);
       console.log(this.dataForm.controls[x].valid);*/
    }
    /*  console.log("this.dataForm.value");
     console.log(this.dataForm.value);
     console.log("this.dataForm.valid");
     console.log(this.dataForm.valid);*/

    if (this.dataForm.valid) {
      const link = this.serverurl + 'addadmin';
      const data = {
        firstname: formval.fname,
        lastname: formval.lname,
        email: formval.email,
        // username: formval.username,
        password: formval.password,
        confirmPassword: formval.confirmPassword,
        address: formval.address,
        telephoneno: formval.telephoneno,
        phoneno: formval.mobileno,
        type: 'admin',

      };

      this._http.post(link, data)
          .subscribe(res => {
            const result = res;
            console.log('res');
            console.log(res);
            this.router.navigate(['/manageadmin']);
          }, error => {
            console.log('');
          });

    }
  }

}
