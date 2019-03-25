import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {DragScrollComponent} from "ngx-drag-scroll/lib";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

    @ViewChild('imgbig') imgbig: DragScrollComponent;

  constructor(private router: Router) { }

  ngOnInit() {
      this.router.events.subscribe(() =>
          window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
          })
      );
  }

    movebigLeft(){
      this.imgbig.moveLeft();
    }

    movebigRight(){
        this.imgbig.moveRight();
    }
}
