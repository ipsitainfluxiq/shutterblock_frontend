import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  public filenamevalc;
  public filenamevalc1;
  public uploadtypec;
  public uploadpathc;
  public filepathc;
  public nameis;
  public profileimage: any;
  public second_image: any;
  public show_second_image: any = 1 ;
  /// public filenameval;
  @Input()
  set filenameval(filenameval: any) {
    // alert(filenameval);
    this.filenamevalc = filenameval;
    console.log('this.filenamevalc');
    console.log(this.filenamevalc);
  }
  @Input()
  set uploadpath(uploadpath: any) {
    // alert(filenameval);
    this.uploadpathc = uploadpath;
    console.log('this.uploadpathc');
    console.log(this.uploadpathc);
  }
  @Input()
  set filepath(filepath: any) {
    // alert(filenameval);
    this.filepathc = filepath;
    console.log('this.filepathc');
    console.log(this.filepathc);
  }
  @Input()
  set uploadtype(uploadtype: any) {
    // alert(filenameval);
    this.uploadtypec = uploadtype;
    console.log('this.uploadtypec');
    console.log(this.uploadtypec);
  }
  // @Output() filenamevalcChange = new EventEmitter<any>();
  // @Output() lfChange = new EventEmitter<any>();

  constructor(public apiService: ApiService) {
    // this.filenamevalc='90';
    this.filenamevalc1 = '90';
    console.log('this.filenamevalc in constructor ... ');
    console.log(this.filenamevalc);
    console.log(this.filenamevalc1);
    // console.log(this.lf);
    // this.filenamevalcChange.emit(this.filenamevalc);
  }
  getval() {
    console.log('this.filenamevalc');
    console.log(this.filenamevalc);
    console.log(this.filenamevalc1);
    // this.filenamevalcChange.emit(this.filenamevalc);
    // this.lfChange.emit(90);
  }
  ngOnInit() {
  }
  delimage(indexval: any) {
    this.apiService.fileservername[this.filenamevalc].splice(indexval,1);
  }

  profileImg(img: any) {
    this.profileimage = img;
    this.apiService.profileimage = img;
    console.log('profile image');
    console.log(this.profileimage);
    this.show_second_image = 0;
  }
  profileImg2(img1: any) {
    this.second_image = img1;
    this.apiService.second_image = img1;
    console.log('second_image');
    console.log(this.second_image);
  }

}
