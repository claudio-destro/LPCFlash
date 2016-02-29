import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LpcFlashUtility} from './app';

const remote = require('electron').remote;

class MyUrlResolver extends UrlResolver {
  resolve(baseUrl: string, url: string): string {
    return super.resolve(`file://${remote.app.getAppPath()}/`, url);
  }
}

let app = bootstrap(LpcFlashUtility, [ROUTER_PROVIDERS, provide(UrlResolver, {useClass: MyUrlResolver})]);
