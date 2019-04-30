import {Component, OnInit, ViewChild} from '@angular/core';
import {DragScrollComponent} from 'ngx-drag-scroll/lib';
import { Router, ActivatedRoute } from '@angular/router';
import {ApiService} from '../api.service';
declare var $: any;


@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  styleUrls: ['./model-profile.component.css'],

})




export class ModelProfileComponent implements OnInit {
public imgbig1: any;
public imgbig2: any;
public arrimg: any;
public imgmodel: any;
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
      if (this.model.profile_img == null ) {
          this.imgbig1 = this.model.images[0];
      } else {
          this.imgbig1 = this.model.profile_img;
      }

    console.log(324);
      $('html, body').animate({
        scrollTop: $('#scrolltotopwrapper').offset().top
      }, 0);

      this.router.events.subscribe(() =>
          window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
          })
      );


  }

    imgClick(img: any) {
        console.log('ok');
        this.imgbig1 = img;
        console.log(this.imgbig1);
        console.log(this.imgbig1);
    }
    modelimg(imgb: any) {
        console.log('modelimg');
        console.log(imgb);
        this.imgmodel = imgb;
        console.log(this.model.images);
        console.log(this.model.images.indexOf(imgb));
        this.arrimg = this.model.images.indexOf(imgb);
        console.log('outside for loop');
        console.log(this.arrimg);
        $('.fullscreenimagewrapper').css('visibility', 'hidden');
        for (let i = 0;  i < this.arrimg ; i++) {
            console.log('in for loop' + i);

            setTimeout(() => {
                this.imgbig.moveRight();
            }, 800);

        }

        setTimeout(() => {
            this.imgbig.moveRight();
            this.imgbig.moveLeft();
            $('.fullscreenimagewrapper').css('visibility', 'visible');
        }, 1300);
    }
    mimg(im: any) {
        console.log('mimg');
        console.log(im);
        im =  this.imgmodel;
        console.log('mimg-end');
        console.log(im);
        return im;
    }
/*

    img1click(imgbig1: any) {
      console.log('oook');
      console.log(imgbig1);
    }

    img1click1(im: any) {
      console.log('ok');
      console.log(im);
    }
*/




    moveLeft() {
        this.imgsmall.moveLeft();
    }

    moveRight() {
        this.imgsmall.moveRight();
    }

    movebigLeft() {
      this.imgbig.moveLeft();
      // console.log(ii);
    }

    movebigRight() {
        this.imgbig.moveRight();
        // console.log(jj);
    }

    gethttplink(val: any) {
            if (val.indexOf('http') == -1 && val.indexOf('https') == -1 && val.indexOf('http') != 0) {
                return "http://" + val;
            }
            return val;
        }

}





