import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'nav-bar',
  templateUrl: 'nav_bar.html',
  directives: [ROUTER_DIRECTIVES]
})

export class NavBar {

  private link: string;

  private selectLink(link) {
    this.link = link;
  }
}
