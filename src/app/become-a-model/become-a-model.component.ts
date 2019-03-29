import {Component, OnInit, EventEmitter, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';

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
  // url1 = 'http://18.222.26.198/upload';
  // url = 'http://18.222.26.198:7002/uploads';
  formData: FormData;
  EventEmitter;
  public dataForm: FormGroup;
  public kp;
  public fileservername;
  public uploadInput:EventEmitter<UploadInput>;
  public humanizeBytes:Function;
  public files;
  public options;
  public filelocalname;
  public endpoint = 'frontendsignup';
  public mysuccessapplication: any = false;
  public issubmit=0;
  public lengthis=0;
  public percentageis=0;
  public nameis=0;
  public uploader:any='upload';
  public uploader1:any='upload1';
  public stateslist:any = [];
  modalRef: BsModalRef;
  dragOver:boolean;



  max: number = 200;
  showWarning: boolean;
  dynamic: number;
  type: string;

  constructor(
      kp: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      public _http: HttpClient,
      public modal: BsModalService,
      public apiService: ApiService,
  ) {
    this.kp = kp;
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    //this.random();
    this.dynamic = 0;
    this.type = 'info';
  }

  random(): void {
    let value = Math.floor(Math.random() * 100 + 1);
    let type: string;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    this.dynamic = value;
    this.type = type;
  }

  ngOnInit() {
    this.apiService.uploadtype = 'single';
    this.apiService.getState().subscribe(res => {
      let result;
      result = res;
      this.stateslist = result;
    }, error => {
      console.log('Oooops!');
    });

    this.dataForm = this.kp.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      email: ["", BecomeAModelComponent.validateEmail],
      city: ['', Validators.required],
      state: ['', Validators.required],
      ethnicity: ['', Validators.required],
      height: ['', Validators.required],
      eyecolor: ['', Validators.required],
      haircolor: ['', Validators.required],
      weight: ['', Validators.required],
      bust: ['', Validators.required],
      waist: ['', Validators.required],
      hips: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      athletic: [''],
      slim: [''],
      toned: [''],
      voluptuous: [''],
      tattoos: [''],
      piercings: [''],
      promotions: ['', Validators.required],
      sales: ['', Validators.required],
      retail: ['', Validators.required],
      descriptionbox: ['', Validators.required],
      facebooklink: ['', Validators.required],
      instagramlink: ['', Validators.required],
      twitterlink: ['', Validators.required],
      modelmayhemlink: ['', Validators.required],
      fileservername: [''],
      filelocalname: [''],
    }, {validator: this.machpassword('password', 'confirmpassword')});
  }

    machpassword(passwordkye: string, confirmpasswordkye: string) {
      return (group: FormGroup) => {
        let passwordInput = group.controls[passwordkye],
            confirmpasswordInput = group.controls[confirmpasswordkye];
        if (passwordInput.value !== confirmpasswordInput.value) {
          return confirmpasswordInput.setErrors({notEquivalent: true});
        }
        else {
          return confirmpasswordInput.setErrors(null);
        }
      };
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

    checkupload(){
      console.log('ghjgjg --iuuyyy ');
      console.log(this.uploader);
      console.log(this.uploader1);
      console.log(this.apiService.fileservername);
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
          this.modalRef = this.modal.show(template);
        }
      }, error => {
        console.log('Oooops!');
      });
    }
  }



}
