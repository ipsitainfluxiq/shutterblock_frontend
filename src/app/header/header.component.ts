import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
   // document.getElementsByClassName('closebtn')[0].style.visibility='hidden';
    document.getElementsByClassName('closebtn')[0]['style'].visibility = 'hidden';
    //  document.getElementById('closebtn').style.visibility='hidden';


    /*var elems = document.getElementsByClassName('closebtn');
    for(var i = 0; i != elems.length; ++i)    {
      elems[i].style.visibility = "hidden"; // hidden has to be a string
    }*/
  }

}
