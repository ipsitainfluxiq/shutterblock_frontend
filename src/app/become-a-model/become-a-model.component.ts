import {Component, OnInit, EventEmitter, TemplateRef, ViewChild, ElementRef} from '@angular/core';
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
  selector: 'app-become-a-model',
  templateUrl: './become-a-model.component.html',
  styleUrls: ['./become-a-model.component.css']
})
export class BecomeAModelComponent implements OnInit {
  formData: FormData;
  EventEmitter;
  public dataForm: FormGroup;
  public kp;
  public modeluploadpath: any = environment.modelfolder;
  public modelfilepath: any = environment.Model_Image_Url;
  public fileservername;
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: Function;
  public files;
  public errormsg;
  public options;
  public filelocalname;
  // public endpoint = 'frontendsignup';
  public endpoint = 'confirmationemail';
  public endpoint1 = 'datalist';
  public mysuccessapplication: any = false;
  public issubmit = 0;
  public lengthis = 0;
  public percentageis = 0;
  public nameis = 0;
  public uploader: any = 'upload';
  public uploader1: any = 'upload1';
  public stateslist: any = [];
  modalRef: BsModalRef;
  dragOver: boolean;



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
    // this.random();
    this.dynamic = 0;
    this.type = 'info';
    /*let data1 = this.apiService.postDatawithottoken(this.endpoint1, this.data1).subscribe(res => {
     let re;
     re = res;
     console.log(re);
     });*/
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
      email: ['', BecomeAModelComponent.validateEmail],
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
      facebooklink: ['', Validators.compose([Validators.pattern('^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$')])],
      instagramlink: ['', Validators.compose( [Validators.required, Validators.pattern('^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$')])],
      twitterlink: ['', Validators.pattern('^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$')],
      modelmayhemlink: ['', Validators.pattern('^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$')],
      fileservername: [''],
      filelocalname: [''],
      type: [''],
      status: [''],
    }, {validator: this.machpassword('password', 'confirmpassword')});
  }

  machpassword(passwordkye: string, confirmpasswordkye: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordkye],
          confirmpasswordInput = group.controls[confirmpasswordkye];
      if (passwordInput.value !== confirmpasswordInput.value) {
        return confirmpasswordInput.setErrors({notEquivalent: true});
      } else {
        return confirmpasswordInput.setErrors(null);
      }
    };
  }

  doclick() {
    // console.log("dfsg");
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
      scrollTop: $('#div_id').offset().top
    }, 2000);
  }
  static validateEmail(control: FormControl){
    if (control.value == '') {
      return { 'invalidemail': true };
    }
    let filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (String(control.value).search(filter) == -1) {
      return { 'invalidemail': true };
    }
  }

  static validateUrl() {
    const filterUrl = '^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$';
  }

  checkupload() {
    console.log('ghjgjg --iuuyyy ');
    console.log(this.uploader);
    console.log(this.uploader1);
    console.log(this.apiService.fileservername);
  }

  dosubmit(template: TemplateRef<any>, erroemodal: TemplateRef<any>) {
    //  this.modalRef = this.modal.show(template, { class: 'modal-md modaldefault'});
    this.issubmit = 1;
    this.errormsg = '';
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }

    console.log(this.apiService.fileservername);
    console.log(this.apiService.fileservername[this.uploader]);
    // console.log(this.apiService.fileservername[this.uploader].length);
    if (this.dataForm.valid) {


      console.log('valid----');
      console.log(this.dataForm.value);
      this.dataForm.patchValue({status: 0});
      this.dataForm.patchValue({type: 'model'});
      console.log('-----------------');
      console.log(this.dataForm.value);



      let data: any;
      data = { source: 'users', data : this.dataForm.value };
      data.data.images = this.apiService.fileservername[this.uploader];

      if (this.apiService.fileservername == null || this.apiService.fileservername[this.uploader] == null || this.apiService.fileservername[this.uploader].length < 4) {
        this.modalRef = this.modal.show(erroemodal, { class: 'modal-md modaldefault'});
      } else {
        // alert(33);
        console.log(this.apiService.fileservername);
        console.log(this.apiService.fileservername[this.uploader]);
        this.apiService.postDatawithottoken(this.endpoint, data).subscribe(res => {
          console.log('okkk');
          let result: any = {};
          result = res;
          if (result.status == 'success') {
            this.dataForm.reset();
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
