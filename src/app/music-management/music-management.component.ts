import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.css']
})
export class MusicManagementComponent implements OnInit {
  fileToUpload: File = null;
  constructor() { }

  ngOnInit() {
  }

}
