import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {NavBarComponent} from "./navbar";
import {UploaderComponent} from "./uploader";
import {SettingsComponent} from "./settings";

@Component({
  selector: "lpcFlashUtility",
  template: `
    <header class="container">
      <navBar></navBar>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  directives: [NavBarComponent, ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: "/", redirectTo: ["Settings"] },
  { path: "/upload", name: "Uploader", component: UploaderComponent },
  { path: "/settings", name: "Settings", component: SettingsComponent, useAsDefault: true }
])

export class LpcFlashUtility {
}
