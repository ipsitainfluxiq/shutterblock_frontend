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
public error: any;
    @ViewChild('imgbig') imgbig: DragScrollComponent;
    showmodal: any;

  constructor(public router: Router, public route: ActivatedRoute, public apiservic: ApiService, public prevrout: prevroute) {
      console.log(router.url);
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
      console.log('current');
      console.log(this.prevrout.currentUrl);
      console.log('prev');
      console.log(this.prevrout.previousUrl);
      if (this.prevrout.currentUrl == this.prevrout.previousUrl) {
          this.error = 'hide';
      }
  }
    previce() {

        this.router.navigate([this.previousurl]);
    }

}
