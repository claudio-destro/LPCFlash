import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'nav-bar',
  styles: [`
    a {cursor: pointer}
    .router-link-active a {color: #333}
    .router-link-active {background-color: #CCC}
  `],
  templateUrl: 'nav_bar.html',
  directives: [ROUTER_DIRECTIVES]
})

export class NavBar {

  constructor(private router: Router) {
    console.dir(router);
  }
}
