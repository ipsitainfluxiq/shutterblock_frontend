import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {windowCount} from 'rxjs/operators';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
declare var $: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  modalRef: BsModalRef;
  public myForm: FormGroup;
  public issubmit = 1;
  public mysuccessapplication1: any = false;
  public endpoint: any = 'addorupdatedata';

  // mysuccess: TemplateRef<any>;
  constructor(private modalService: BsModalService, public fb: FormBuilder, public apiService: ApiService) {
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)])],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
    /* console.log('in ng oninit !!');
     console.log($('.newhome_header').height());
     console.log($('#newmyCarousel').height());
     console.log($('app-header').length);
     console.log($('.newhome_header').width());
     console.log($('#newmyCarousel').width());
     console.log($(window).height());*/
  }

  doclick1() {
    console.log('dfsg');
    this.mysuccessapplication1 = true;
    console.log(' this.mysuccessapplication1');
    console.log(this.mysuccessapplication1);
    $('.mysuccessapplication').css('modalopen');
  }

  doclick1close() {
    this.mysuccessapplication1 = false;
  }

  doSubmit(mysuccess: TemplateRef<any>) {
    console.log('000000');
    this.issubmit = 1;
    console.log('myForm');
    let x: any;
    // tslint:disable-next-line:forin
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }
    console.log('this.myForm.value');
    console.log(this.myForm.value);
    const data = this.myForm.value;
    const data1 = {source: 'contactUs', data: data};
    this.apiService.postDatawithottoken(this.endpoint, data1).subscribe(res => {
      let result: any = {};
      result = res;
      console.log(result);
      if (result.status == 'success') {
        this.myForm.reset();
        this.modalRef = this.modalService.show(mysuccess);
      } else {
        console.log('oops');
      }
    });
  }

  hide() {
    this.modalRef.hide();
  }
}
