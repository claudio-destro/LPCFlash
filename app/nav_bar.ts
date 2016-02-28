import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'nav-bar',
  template:
  `<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
        aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <span class="navbar-brand">LPC Flash Utility</span>
      </div>
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li [class.active]="link === 'Uploader'"><a [routerLink]="['Uploader']" (click)="selectLink('Uploader')">Upload</a></li>
          <li [class.active]="link === 'Settings'"><a [routerLink]="['Settings']" (click)="selectLink('Settings')">Settings</a></li>
        </ul>
      </div>
    </div>
  </nav>`,
  directives: [ROUTER_DIRECTIVES]
})

export class NavBar {

  private link: string;

  private selectLink(link) {
    this.link = link;
  }
}
