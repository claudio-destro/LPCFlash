import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {NavBar} from './nav_bar';
import {Uploader} from './uploader';
import {Settings} from './settings';

@Component({
  selector: 'lpcFlashUtility',
  template: `
    <header class="container">
      <navBar></navBar>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
    `,
  directives: [NavBar, ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/upload', name: 'Uploader', component: Uploader },
  { path: '/settings', name: 'Settings', component: Settings }
])

export class LpcFlashUtility {
}
