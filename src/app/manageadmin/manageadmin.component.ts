import { Component, OnInit,TemplateRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-manageadmin',
  templateUrl: './manageadmin.component.html',
  styleUrls: ['./manageadmin.component.css'],
  providers: [Commonservices]
})
export class ManageadminComponent implements OnInit {
  public serverurl;
  public message: any = '';
  public datalist: any = [];
  modalRef: BsModalRef;
  private selectedadminid: any;

  constructor(private router: Router,  private _commonservices: Commonservices, private _http: HttpClient, private modalservice: BsModalService) {
    this.serverurl = _commonservices.url;
  }

  ngOnInit() {

    this.getadminlist();
  }

  getadminlist() {
    let link = this.serverurl + 'adminlist?' + new Date().getTime();
    this._http.get(link)
        .subscribe(res => {
          let result;
          result = res;
          this.datalist = [];
          this.datalist = result.res;
          console.log(this.datalist);

        }, error => {
          console.log('Oooops!');
        });

  }

  deleteadmin(id: any, template: TemplateRef<any>){
    this.modalRef = this.modalservice.show(template);
    this.selectedadminid = id;
  }
  delete(id: any , template: TemplateRef<any>)
  {
    this.message = 'Admin Deleted Successfully!';
    let link = this.serverurl + 'deleteuser';
    let data = {id: id};
    this.modalRef.hide();

    this._http.post(link, data)
        .subscribe(res => {
          let result;
          result = res;
          //    console.log(result);
          if(result.status == 'success'){
            setTimeout(()=> {
              this.modalRef = this.modalservice.show(template);
              this.getadminlist();
            }, 4000);
          }
        }, error => {
          console.log('Oooops!');
        });
  }

  decline(){
    this.message = 'Declined!';
    this.modalRef.hide();
  }


}
