import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {windowCount} from 'rxjs/operators';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalRef: BsModalRef;
  public myForm: FormGroup;
  public issubmit = 1;
  public mysuccessapplication1: any = false;
  // mysuccess: TemplateRef<any>;
  constructor(private modalService: BsModalService, public fb: FormBuilder) {}
  ngOnInit() {
    this.myForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('/^\\s*[\\w\\-\\+_]+(\\.[\\w\\-\\+_]+)*\\@[\\w\\-\\+_]+\\.[\\w\\-\\+_]+(\\.[\\w\\-\\+_]+)*\\s*$/')])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('/^-?(0|[1-9]\d*)(?<!-0)$/')])],
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
    this.issubmit = 1;
    console.log('myForm');
    let x: any;
    // tslint:disable-next-line:forin
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }
    if (this.myForm.valid) {
      console.log('this.myForm.value');
      console.log(this.myForm.value);
      this.modalRef = this.modalService.show(mysuccess);
    }
  }
  hide() {
    this.modalRef.hide();
  }

  ngAfterViewChecked () {

    /*console.log('in ng ngAfterViewChecked !!');
    console.log($('.newhome_header').height());
    setTimeout(()=>{    //<<<---    using ()=> syntax
      console.log('newmyCarousel height');
      console.log($('.newhomeslider').height());
    }, 500);



    console.log($('app-header').length);
    console.log($('.newhome_header').width());
    console.log($('#newmyCarousel').width());
    console.log($(window).height());
    let windowheight=$(window).height();

    $('.newhome_header').height(287.22/755.78*windowheight);
    $('#newmyCarousel').height(468.56/755.78*windowheight);
    $('#newmyCarousel').find('.item').height(468.56/755.78*windowheight);
    //$('#newmyCarousel').find('.item').find('section').height(468.56/755.78*windowheight);
    $('#newmyCarousel').find('.item').find('img').height(468.56/755.78*windowheight);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);*/
  }

}
