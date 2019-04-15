import {Component, OnInit, ViewChild} from '@angular/core';
import {DragScrollComponent} from "ngx-drag-scroll/lib";
import { Router, ActivatedRoute } from '@angular/router';
import {ApiService} from '../api.service';
declare var $:any;


@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  styleUrls: ['./model-profile.component.css'],

})




export class ModelProfileComponent implements OnInit {
public imgbig1:any;
    /*@ViewChild('nav', {read: DragScrollComponent}) ds: DragScrollComponent;*/

    @ViewChild('imgbig') imgbig: DragScrollComponent;
    @ViewChild('imgsmall') imgsmall: DragScrollComponent;


  constructor(public router: Router, private route: ActivatedRoute, public apiservice: ApiService) {

  }
public model: any;
  ngOnInit() {

      this.route.data.forEach((data) => {
          // PRE LOAD DATA PRIOR
          console.log('data from route ... !!!');
          console.log(data);
          console.log('json', data['results'].result1[0]);
          // console.log(data['results'].results[0].images[0]);
          this.model = data['results'].result1[0];

          console.log(data['results']);
      });
      this.imgbig1 = this.model.images[0];

    console.log(324);
      $('html, body').animate({
        scrollTop: $('#scrolltotopwrapper').offset().top
      }, 0);



  }

    imgClick(img: any) {
      console.log('ok');
      this.imgbig1 = img;
      console.log(this.imgbig1);
    }


    moveLeft() {
        this.imgsmall.moveLeft();
    }

    moveRight() {
        this.imgsmall.moveRight();
    }

    movebigLeft(){
      this.imgbig.moveLeft();
    }

    movebigRight() {
        this.imgbig.moveRight();
    }






}





