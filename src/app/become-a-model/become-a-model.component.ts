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
  url1 = 'http://18.222.26.198/upload';
  url = 'http://18.222.26.198:7002/uploads';
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  @ViewChild('fileInput1') uploaderInput: ElementRef;
  public lengthis;
  public percentageis;
  public nameis;
  public dataForm: FormGroup;
  public kp;
  public fileservername;
  public filelocalname;
  public endpoint = 'frontendsignup';
  public mysuccessapplication: any = false;
  public issubmit=0;
  public stateslist:any = [];
  modalRef: BsModalRef;

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
  }

  ngOnInit() {
    this.apiService.getState().subscribe(res => {
      let result;
      result = res;
      this.stateslist = result;
      // console.log('All staes.....');
      // console.log(this.stateslist);
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
      password: ['',Validators.required],
      confirmpassword: ['',Validators.required],
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
      modelmayhemlink: ['',Validators.required],
      fileservername: [''],
      filelocalname: [''],
    });
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
/*  onUploadOutput(output: UploadOutput): void {

    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: '/upload',
        //   method: 'POST',
        //   data: { foo: 'bar' }
        // };
        // this.uploadInput.emit(event);
          console.log('allAddedToQueue');
        break;
      case 'addedToQueue':

        if (typeof output.file !== 'undefined') {
          console.log(output.file.type);
          this.files.push(output.file);
          console.log(this.files);
        }
        // console.log('addedToQueue');
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
          console.log(this.files[0]);
        }
        // console.log('uploading');
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }

  startUpload(): void {
    console.log("all ok");
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://18.222.26.198:7002/uploads',
      // method: 'POST',
      // data: { foo: 'bar' }
    };
console.log(event);
    this.uploadInput.emit(event);
    console.log(this.uploadInput);
    console.log(this.uploadInput.emit(event));
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }*/

/*  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.url,
        // method: 'POST',
        // data: { foo: 'bar' }
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }*/

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      // method: 'POST',
      // data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }





onUploadOutput(output: UploadOutput): void {
  this.uploaderInput.nativeElement.value = '';
  if (output.type === 'allAddedToQueue') {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
    };
    this.uploadInput.emit(event);
  } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
    if (output.file.response != '') {
      this.files = [];
      this.files.push(output.file);
      console.log('this.files*********');
      console.log(this.files);
      this.lengthis = this.files.length;
      this.percentageis = this.files[0].progress.data.percentage;
    }
  } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
    const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
    this.files[index] = output.file;
    this.lengthis = this.files.length;
    this.percentageis = this.files[0].progress.data.percentage;
    console.log('this.files==================');
    console.log(this.files);
  } else if (output.type === 'removed') {
    this.files = this.files.filter((file: UploadFile) => file !== output.file);
  } else if (output.type === 'dragOver') {
    this.dragOver = true;
  } else if (output.type === 'dragOut') {
    this.dragOver = false;
  } else if (output.type === 'drop') {
    this.dragOver = false;
  }
  console.log('files-');
  console.log(this.files);
  if (this.files.length > 0 && this.files[0].name != null && this.files[0].response != null) {
    this.lengthis = this.files.length;
    this.percentageis = this.files[0].progress.data.percentage;
    this.nameis = this.files[0].name;
    console.log(this.files[0].response);
    console.log(this.files[0].name);
    console.log(this.lengthis);
    this.dataForm.patchValue({
      fileservername : this.files[0].response,
      filelocalname : this.files[0].name
    });
    // this.fileservername = this.dataForm.controls['fileservername'];
    this.fileservername = this.files[0].response;
  }
}

}
