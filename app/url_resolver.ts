import {UrlResolver} from 'angular2/compiler';

const remote = require('electron').remote;

export class MyUrlResolver extends UrlResolver {
  resolve(baseUrl: string, url: string): string {
    return super.resolve(`file://${remote.app.getAppPath()}/`, url);
  }
}
