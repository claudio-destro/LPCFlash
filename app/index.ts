import * as ng2 from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LpcFlashUtility} from './app';

let app = ng2.bootstrap(LpcFlashUtility, [ROUTER_PROVIDERS]);
