import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminleft',
  templateUrl: './adminleft.component.html',
  styleUrls: ['./adminleft.component.css']
})
export class AdminleftComponent implements OnInit {
  public show:boolean = true;
  public buttonName:any = '+';

  constructor() { }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)
      this.buttonName = "-";
    else
      this.buttonName = "+";
  }
  ngOnInit() {
  }

}
