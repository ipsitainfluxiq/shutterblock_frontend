import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, Event, ActivatedRoute} from '@angular/router';
import {DragScrollComponent} from 'ngx-drag-scroll/lib';
import { ApiService } from '../api.service';
import { prevroute } from '../prevroute';



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
public loginurl: any;
public prevroute: any;
public previousurl: any;
    @ViewChild('imgbig') imgbig: DragScrollComponent;
    showmodal: any;

  constructor(public router: Router, public route: ActivatedRoute, public apiservic: ApiService, public prevrout: prevroute) {
      console.log(router.url);
      if (router.url == router.url) {

      }
  }

  ngOnInit() {
      this.router.events.subscribe(() =>
          window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
          })
      );
      this.previousurl = this.prevrout.getPreviousUrl();
      console.log(this.previousurl);
  }
    previce() {
        this.router.navigate([this.previousurl]);
    }

    /* movebigLeft() {
       this.imgbig.moveLeft();
     }

     movebigRight() {
         this.imgbig.moveRight();
     }*/
}
