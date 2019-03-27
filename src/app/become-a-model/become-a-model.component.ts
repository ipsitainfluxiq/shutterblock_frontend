import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from '../../app/api.service';
import { Resolveservice } from '../../app/resolveservice';
declare var $:any;
@Component({
  selector: 'app-become-a-model',
  templateUrl: './become-a-model.component.html',
  styleUrls: ['./become-a-model.component.css']
})
export class BecomeAModelComponent implements OnInit {
  public dataForm: FormGroup;
  public kp;
  public endpoint = 'frontendsignup';
  public mysuccessapplication: any = false;
  public issubmit=0;
  public stateslist:any = [];
  modalRef: BsModalRef;

  constructor(kp: FormBuilder, private router: Router, private route: ActivatedRoute, public _http: HttpClient, public modal: BsModalService, public apiService: ApiService) {
    this.kp = kp;
  }

  ngOnInit() {
    this.apiService.getState().subscribe(res =>{
      let result;
      result = res;
      this.stateslist = result;
      console.log('All staes.....');
      console.log(this.stateslist);
    }, error => {
      console.log('Oooops!');
    });
    /*this._http.get("assets/data/state.json")
        .subscribe(res => {
          let result;
          result = res;
          this.stateslist = result;
          console.log('All staes.....');
          console.log(this.stateslist);
        }, error => {
          console.log('Oooops!');
        });*/


    this.dataForm =  this.kp.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      age: ['',Validators.required],
      phone: ['',Validators.required],
      email: ["", BecomeAModelComponent.validateEmail],
      city: ['',Validators.required],
      state: ['',Validators.required],
      ethnicity: ['',Validators.required],
      height: ['',Validators.required],
      eyecolor: ['',Validators.required],
      haircolor: ['',Validators.required],
      weight: ['',Validators.required],
      bust: ['',Validators.required],
      waist: ['',Validators.required],
      hips: ['',Validators.required],
      athletic: [''],
      slim: [''],
      toned: [''],
      voluptuous: [''],
      tattoos: [''],
      piercings: [''],
      promotions: ['',Validators.required],
      sales: ['',Validators.required],
      retail: ['',Validators.required],
      descriptionbox: ['',Validators.required],
      facebooklink: ['',Validators.required],
      instagramlink: ['',Validators.required],
      twitterlink: ['',Validators.required],
      modelmayhemlink: ['',Validators.required]});
  }

  doclick() {
    console.log("dfsg");
    this.mysuccessapplication = true;
    console.log(' this.mysuccessapplication');
    console.log(this.mysuccessapplication);
    $('.mysuccessapplication').css('modalopen');
  }

  doclickclose() {
    this.mysuccessapplication = false;
  }

  scrolltoform() {
    $('html, body').animate({
      scrollTop: $("#div_id").offset().top
    }, 2000);
  }


  static validateEmail(control: FormControl){
    if(control.value==''){
      return { 'invalidemail': true };
    }
    let filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (String(control.value).search(filter) == -1) {
      return { 'invalidemail': true };
    }
  }


  dosubmit(template:TemplateRef<any>) {
    this.issubmit=1;
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }
    if (this.dataForm.valid) {
      console.log('valid');
      console.log(this.dataForm.value);
      let data = {source:'users',data:this.dataForm.value};
      this.apiService.postDatawithottoken(this.endpoint, data).subscribe(res => {
        console.log("okkk");
        let result: any = {};
        result = res;
        if (result.status == 'success') {
          this.modalRef = this.modal.show(template, {class: 'modaldefault'});
        }
      }, error => {
        console.log('Oooops!');
      });
    }
  }
}
