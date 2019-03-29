import {Injectable, ViewChild,EventEmitter,ElementRef} from '@angular/core';
import { Observable, interval, pipe } from 'rxjs';
import { switchMap, map, takeWhile } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import {UploaderComponent} from "./uploader/uploader.component";

@Injectable()
export class ApiService {

  public domain =  environment['API_URL'];
  public _url = environment['API_URL'];
  public Model_Image_Url = environment['Model_Image_Url'];
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  @ViewChild('fileInput1') uploaderInput: ElementRef;
  public lengthis;
  public percentageis;
  public progress:any=0;
  public uploadtype;
  fileservername:any=[];

  constructor(private _http: HttpClient,
              private _authHttp: HttpClient,
              private cookieService: CookieService,
              //private uploaderservice: UploaderComponent
              // public jwtHelper: JwtHelperService,
              // private loggedinService: LoggedinService
              ) {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

    console.log('this.domain');
    console.log(this.domain);
  }



  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.domain+'uploads',
      method: 'POST',
      /*headers: new HttpHeaders({
       'Authorization': this.cookieService.get('jwttoken')
       }),*/
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }





  onUploadOutput(output: UploadOutput,classval:UploaderComponent): void {
    //this.uploaderInput.nativeElement.value = '';
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.domain+'uploads',
        method: 'POST',
        data: { path: 'modelimages' }
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      if (output.file.response != '') {
        this.files = [];
        this.files.push(output.file);
        console.log('this.files*********');
        console.log(this.files);
        this.lengthis = this.files.length;
        this.percentageis = this.files[0].progress.data.percentage;
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      this.lengthis = this.files.length;
      this.percentageis = this.files[0].progress.data.percentage;
      console.log('this.files==================');
      console.log(this.files);
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    console.log('files-');
    console.log(this.files);
    if(this.files[0].progress!=null) {
      this.progress=0;
      console.log('this.files[0].progress.data.percentage');
      console.log(this.files[0].progress.data.percentage);
      this.progress = (this.files[0].progress.data.percentage);
      if(this.progress==100) this.progress=null;
      console.log('this.uploadtype');
      console.log(this.uploadtype);
    }
    if(this.uploadtype=='single'){
      this.fileservername=[];
      if(this.files[0].response!=null) this.fileservername.push(this.files[0].response);
    }
    if(this.uploadtype=='multiple'){
      console.log('this.files[0].response');
      console.log(this.files[0].response);
      if(this.files[0].response!=null) this.fileservername.push(this.files[0].response);
    }
    console.log('this.fileservername');
    console.log(this.fileservername);
    //this.uploaderservice.filenamevalc1=this.fileservername;
    //UploaderComponent.filenamevalc1=87;
    console.log(classval);

  }


  isTokenExpired() {

    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(localStorage.getItem('id_token'));
    // var isIdTokenExpired = helper.isTokenExpired(localStorage.getItem('id_token'));
    // console.log('refresh_token',localStorage.getItem('refresh_token'))
    // const isRefreshTokenExpired = helper.isTokenExpired(localStorage.getItem('refresh_token'));
    // console.log('id_token isExpired:',isIdTokenExpired)
    // console.log('refresh_token isExpired:',isRefreshTokenExpired)



  }

  getData(endpoint: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.cookieService.get('jwttoken')
      })
    };
    console.log('endpoint');
    console.log(endpoint);
    console.log(this.cookieService.get('jwttoken'));

    // this.isTokenExpired()
    var result = this._http.post(this._url + 'test1', endpoint, httpOptions).pipe(map(res => res));

    return result;
  }
  // getData end

  postData(endpoint:any, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.cookieService.get('jwttoken')
      })
    };
    console.log(this.cookieService.get('jwttoken'));
    console.log('endpoint');
    console.log(endpoint);
    var result = this._http.post(this.getEndpointUrl(endpoint), JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  } // postData end



  getState() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        // 'Authorization': this.cookieService.get('jwttoken')
      })
    };
    var result = this._http.get('assets/data/state.json').pipe(map(res => res));
return result;
  }
  // getState end



  postDatawithottoken(endpoint:any, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        // 'Authorization': this.cookieService.get('jwttoken')
      })
    };
    console.log(this.cookieService.get('jwttoken'));
    console.log('endpoint');
    console.log(endpoint);
    var result = this._http.post(this.getEndpointUrl(endpoint), JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  } // postData end






  putData(endpoint:any, data, id:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('jwttoken')
      })
    };
    console.log(this.cookieService.get('jwttoken'));
    console.log("endpoint");
    console.log(endpoint);
    var result = this._http.put(this.getEndpointUrl(endpoint) + '/' + id, JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  }



  private getEndpointUrl(endpoint: string) {
      return this._url + endpoint;
  }

}
