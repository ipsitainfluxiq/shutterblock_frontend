/**
 * Created by kta pc on 7/25/2017.
 */
import {Injectable} from '@angular/core';
/*//import {Http, Response} from '@angular/http';*/
import {  HttpClient } from '@angular/common/http';
@Injectable()
export class Commonservices {
    items: Array<any>;
    url: any;
    uploadurl: any;
    fileurl: any;
    public filedeleteurl: string;
    public verifyurl: any;
    public filepathurl: string;


    // constructor(private http: Http) {
    constructor(private http: HttpClient) {
        this.url = 'http://getmyoffers.influxiq.com/server1.php?q=';
        /*this.uploadurl = 'http://emponboarding.westcoastvg.online/php/fileupload.php';
         this.filedeleteurl = 'http://emponboarding.westcoastvg.online/php/scrappage.php';
         this.fileurl = 'http://emponboarding.westcoastvg.online/php/uploads/';*/
        this.verifyurl = 'http://getmyoffers.influxiq.com/php/smsverification.php';
        this.uploadurl = 'http://getmyoffers.influxiq.com/php/fileupload.php';
        this.filepathurl = 'http://getmyoffers.influxiq.com/nodeserver/uploads/';
        /*  if (window.location.hostname == 'localhost') {
         this.url = 'http://localhost:3000/';
         } else {
         //  this.url = 'http://influxiq.com:3014/';
         this.url = 'http://geofencedsp.com:3000/';
         }*/
    }
    shorten(str, maxLen, separator = '') {
        if (str.length <= maxLen) { return str; }
        // return str.substr(0, str.lastIndexOf(separator, maxLen));
        return str.substr(0, maxLen);
    }
}
