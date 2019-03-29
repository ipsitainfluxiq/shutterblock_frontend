import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  public filenamevalc;
  public filenamevalc1;
  ///public filenameval;
  @Input()
  lf: string;
  @Input()
  set filenameval(filenameval: any) {
    this.filenamevalc = filenameval;
  }
  @Output() filenamevalcChange = new EventEmitter<any>();
  @Output() lfChange = new EventEmitter<any>();

  constructor(public apiService: ApiService) {
    this.filenamevalc='90';
    this.filenamevalc1='90';
    console.log('this.filenamevalc in constructor ... ');
    console.log(this.filenamevalc);
    console.log(this.filenamevalc1);
    //this.filenamevalcChange.emit(this.filenamevalc);
  }
  getval(){
    console.log('this.filenamevalc');
    console.log(this.filenamevalc);
    console.log(this.filenamevalc1);
    this.filenamevalcChange.emit(this.filenamevalc);
    this.lfChange.emit(90);
  }
  ngOnInit() {
  }

}
