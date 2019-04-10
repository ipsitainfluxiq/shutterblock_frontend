import { Component, OnInit } from '@angular/core';
import { ApiService} from '../api.service';

@Component({
  selector: 'app-oldheader',
  templateUrl: './oldheader.component.html',
  styleUrls: ['./oldheader.component.css']
})
export class OldheaderComponent implements OnInit {

  constructor(public apiservice: ApiService) { }

  ngOnInit() {
  }

}
