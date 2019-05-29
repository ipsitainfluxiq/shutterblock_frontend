import {Component, EventEmitter, OnInit, TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';

import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ApiService } from '../../app/api.service';
import { Resolveservice } from '../../app/resolveservice';
import { environment } from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.css']
})
export class MusicManagementComponent implements OnInit {
  fileToUpload: File = null;
  public myForm: FormGroup;
  public issubmit = 0;
  public stateslist: any = [];
  modalRef: BsModalRef;
  public modeluploadpath: any = environment.modelfolder;
  public modelfilepath: any = environment.Model_Image_Url;
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: Function;
  public files;
  public errormsg;
  public options;
  public filelocalname;
  // public endpoint = 'frontendsignup';
  public endpoint = 'addorupdatedata';
  public mysuccessapplication: any = false;
  public lengthis = 0;
  public percentageis = 0;
  public nameis = 0;
  public uploader: any = 'upload';
  public uploader1: any = 'upload1';
  dragOver: boolean;



  max:number = 200;
  showWarning: boolean;
  dynamic: number;
  type: string;
  constructor(public fb: FormBuilder, public apiService: ApiService, public modal: BsModalService) {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    // this.random();
    this.dynamic = 0;
    this.type = 'info';
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

    this.myForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      descriptionbox: ['', Validators.required],
      facebooklink: ['', Validators.required],
      soundcloud: ['', Validators.required],
      // email: ['', Validators.required],
      status: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)])],
      fileservername: [''],
      filelocalname: [''],
    });
  }
  doSubmit(template: TemplateRef<any>, erroemodal: TemplateRef<any>) {
    this.issubmit = 1;
    let x: any;
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }
    console.log(this.myForm.value);
    if (this.myForm.valid) {


      console.log('valid----');
      console.log(this.myForm.value);
      this.myForm.patchValue({status: 1});
      // this.myForm.patchValue({type: 'model'});
      console.log('-----------------');
      console.log(this.myForm.value);
      let data;
      data = { source: 'musicsubmission', data : this.myForm.value };
      data.data.images = this.apiService.fileservername[this.uploader];
      console.log(data);

      if (this.apiService.fileservername == null || this.apiService.fileservername[this.uploader] == null || this.apiService.fileservername[this.uploader].length < 3 ) {
        this.modalRef = this.modal.show(erroemodal, { class: 'modal-md modaldefault'});
      } else {
        // alert(33);
        // console.log(this.apiService.fileservername);
        // console.log(this.apiService.fileservername[this.uploader]);
        // console.log(data);
        this.apiService.postDatawithottoken(this.endpoint, data).subscribe(res => {
          console.log('okkk');
          let result: any = {};
          result = res;
          if (result.status == 'success') {
            this.myForm.reset();
            this.apiService.fileservername[this.uploader] = [];
            this.modalRef = this.modal.show(template, { class: 'modal-md modaldefault'});
          } else if (result.status == 'error') {
            this.errormsg = result.msg;
          }
        }, error => {
          console.log('Oooops!');
        });
      }
    }
    }
  closemodal() {
    // console.log("ok");
    this.modalRef.hide();
  }
}
