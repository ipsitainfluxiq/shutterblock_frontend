import {Component, OnInit, ViewChild} from '@angular/core';
import {DragScrollComponent} from "ngx-drag-scroll/lib";

declare var $:any;


@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  styleUrls: ['./model-profile.component.css'],

})




export class ModelProfileComponent implements OnInit {

    /*@ViewChild('nav', {read: DragScrollComponent}) ds: DragScrollComponent;*/

    @ViewChild('imgbig') imgbig: DragScrollComponent;
    @ViewChild('imgsmall') imgsmall: DragScrollComponent;


  constructor() { }

  ngOnInit() {
    console.log(324);
      $('html, body').animate({
        scrollTop: $("#scrolltotopwrapper").offset().top
      }, 0);



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

    movebigRight(){
        this.imgbig.moveRight();
    }






}





