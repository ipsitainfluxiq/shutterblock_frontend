import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-our-models',
  templateUrl: './our-models.component.html',
  styleUrls: ['./our-models.component.css']
})
export class OurModelsComponent implements OnInit {
  public model: any;
  constructor(public router: Router, private route: ActivatedRoute, public apiservice: ApiService) { }

  ngOnInit() {
   /* this.route.data.forEach( (data)=>{
      console.log(data);
    });*/

    this.route.data.forEach((data) => {
      // PRE LOAD DATA PRIOR
      console.log('data from route ... !!!');
      console.log(data);
      console.log('json', data['results']);
      console.log(data['results'].results);
      console.log(data['results'].results[0].images[0]);
      this.model = data['results'].results;
    });
  }

}
