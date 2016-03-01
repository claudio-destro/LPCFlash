import {Component, View, enableProdMode} from 'angular2/core';
import {disableDebugTools} from 'angular2/platform/browser';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {NavBar} from './nav_bar';
import {LogConsole} from './log_console';
import {Uploader} from './uploader';
import {SerialPortChooser} from './serial_port_chooser';

@Component({
  selector: 'lpc-flash-utility',
  template: `
    <header class="container">
      <nav-bar></nav-bar>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
    `,
  directives: [NavBar, ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/settings', name: 'Settings', component: SerialPortChooser, useAsDefault: true },
  { path: '/upload',   name: 'Uploader', component: Uploader }
])

export class LpcFlashUtility {
}

enableProdMode();
disableDebugTools();
