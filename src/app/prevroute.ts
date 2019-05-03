import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

/** A router wrapper, adding extra functions. */
@Injectable()
export class prevroute {

  public previousUrl: string = undefined;
  public currentUrl: string = undefined;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    console.log('start');
    console.log('prev- ' + this.previousUrl);
    console.log('currnt- ' + this.currentUrl);
    console.log('end');
      return this.previousUrl;
  }
}
