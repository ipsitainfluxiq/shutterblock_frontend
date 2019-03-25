import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.css'],
  providers: [Commonservices]

})
export class BrandlistComponent implements OnInit {
  public serverurl;
  public brandlist: any = [];
  modalRef:BsModalRef;
  private selectedbrandid: any;
  public message:any='';
  public message1:any='';
  private selectedbrand: any;
  public islistview: any;

  constructor(private router: Router, private _commonservices: Commonservices, private _http: HttpClient, private modalservice:BsModalService) {
    this.serverurl=_commonservices.url;

  }

  ngOnInit() {
    this.getbrandlist();
  }
  getbrandlist(){
    let link=this.serverurl+'brandlist?';
    this._http.get(link)
        .subscribe(res => {
          let result;
          result = res;
          this.brandlist = [];
          this.brandlist = result.res;
          console.log(this.brandlist);
        }, error => {
          console.log('Oooops! error');
        });
  }
  deletebrand(id:any,template:TemplateRef<any>){
    this.modalRef = this.modalservice.show(template);
    this.selectedbrandid=id;
  }
  delete(id:any,template:TemplateRef<any>){
    this.message='Brand Deleted Successfully!';
    let link = this.serverurl + 'deletebrand';
    let data={id:this.selectedbrandid};
    this.modalRef.hide();

    this._http.post(link,data)
        .subscribe(res => {
          let result;
          result = res;
          if(result.status=='success'){
            setTimeout(()=> {
              this.modalRef = this.modalservice.show(template);
              this.getbrandlist();
            }, 2000);
          }
        }, error => {
          console.log('Oooops!');
        });
  }

  togglebrandstatus(id:any,template:TemplateRef<any>){

    this.modalRef = this.modalservice.show(template);
    this.selectedbrandid = id._id;
    this.selectedbrand = id;

  }
  decline(){
    this.message='Declined!';
    this.modalRef.hide();
  }

  togglestatus(id:any,template: TemplateRef<any>){
    this.message1 = 'Brand Status Updated Successfully!';
    let link = this.serverurl + 'toggleuserstatusserver';
    let tempstatus:any;
    console.log('this.selectedbrand.status');
    console.log(this.selectedbrand.status);
    if(this.selectedbrand.status==null) tempstatus=0;
    else tempstatus=this.selectedbrand.status;
    let data = {_id: this.selectedbrand._id,status:tempstatus};
    //this.selecteduser=id;
    console.log('data');
    console.log(data);
    this.modalRef.hide();

    this._http.post(link, data)
        .subscribe(res => {
          let result;
          result = res;
          //    console.log(result);
          if(result.status == 'success'){
            setTimeout(()=> {
              this.modalRef = this.modalservice.show(template);
              this.getbrandlist();
            }, 2000);
          }
        }, error => {
          console.log('Oooops!');
        });

  }


}
