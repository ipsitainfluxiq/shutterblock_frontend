import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {DragScrollComponent} from "ngx-drag-scroll/lib";
import { ApiService } from '../api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
public loginurl: any;
    @ViewChild('imgbig') imgbig: DragScrollComponent;
    showmodal: any;

  constructor(public router: Router, public apiservic: ApiService) {
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
  }

    movebigLeft() {
      this.imgbig.moveLeft();
    }

    movebigRight() {
        this.imgbig.moveRight();
    }
}
