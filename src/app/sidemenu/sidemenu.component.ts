import {Component, OnInit, TemplateRef} from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
public show: any = 1;

  modalRef: BsModalRef;


  constructor(public modalService: BsModalService, public apiService: ApiService, public router: Router) { }


  promoEvent(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, { class: 'promoEvent modaldefault'});
  }

  mediaDivision(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, { class: 'promoEvent modaldefault'});
  }

  hide(){
    this.modalRef.hide();
  }
  ngOnInit() {
  }
}
