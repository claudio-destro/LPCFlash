import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LpcFlashUtility} from './app';
import {MyUrlResolver} from './url_resolver';

bootstrap(LpcFlashUtility, [ROUTER_PROVIDERS, provide(UrlResolver, {useClass: MyUrlResolver})]);
