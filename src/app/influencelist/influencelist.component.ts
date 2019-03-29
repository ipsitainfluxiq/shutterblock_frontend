import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-influencelist',
  templateUrl: './influencelist.component.html',
  styleUrls: ['./influencelist.component.css'],
  providers: [Commonservices],
})
export class InfluencelistComponent implements OnInit {

  public serverurl;
  public influencerlist: any = [];
  modalRef:BsModalRef;
  public selectedadminid: any;
  public message: any;
  public message1:any;
  private selectedinfluencerid:any;
  private selectedinfluencer: any;
  public islistview: any=0;

  constructor(private router: Router, private _commonservices: Commonservices, private _http: HttpClient, private modalservice:BsModalService,) {

    this.serverurl=_commonservices.url;
  }

  ngOnInit() {

    this.getinfluencerlist();
  }

  getinfluencerlist(){

    let link=this.serverurl+'influencerlist?';
    this._http.get(link)
        .subscribe(res => {
          let result;
          result = res;
          this.influencerlist = [];
          this.influencerlist = result.res;
          console.log(this.influencerlist);
        }, error => {
          console.log('Oooops! error');
        });
  }

  deleteinfluencer(id:any,template:TemplateRef<any>){
    this.modalRef = this.modalservice.show(template);
    this.selectedadminid=id;
  }
  delete(id:any,template:TemplateRef<any>){
    this.message='Influencer Deleted Successfully!';
    let link = this.serverurl + 'deleteinfluencer';
    let data={id:this.selectedadminid};
    this.modalRef.hide();

    this._http.post(link,data)
        .subscribe(res => {
          let result;
          result = res;
          if(result.status=='success'){
            setTimeout(()=> {
              this.modalRef = this.modalservice.show(template);
              this.getinfluencerlist();
            }, 2000);
          }
        }, error => {
          console.log('Oooops!');
        });
  }
  decline(){
    this.message='Declined!';
    this.modalRef.hide();
  }

  toggleinfluencerstatus(id:any,template:TemplateRef<any>){

    this.modalRef = this.modalservice.show(template);
    this.selectedinfluencerid = id._id;
    this.selectedinfluencerid = id;


  }

  togglestatus(id:any,template:TemplateRef<any>){

    this.message1 = 'Influencer Status Updated Successfully!';
    let link = this.serverurl + 'toggleinfluencerstatus';
    let tempstatus:any;
    console.log('this.selectedbrand.status');
    console.log(this.selectedinfluencer.status);
    if(this.selectedinfluencer.status==null) tempstatus=0;
    else tempstatus=this.selectedinfluencer.status;
    let data = {_id: this.selectedinfluencer._id,status:tempstatus};
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
              this.getinfluencerlist();
            }, 2000);
          }
        }, error => {
          console.log('Oooops!');
        });

  }



}
