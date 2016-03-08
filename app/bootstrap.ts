import {bootstrap, disableDebugTools} from 'angular2/platform/browser';
import {provide, enableProdMode} from 'angular2/core';
import {UrlResolver} from 'angular2/compiler';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {MyUrlResolver} from './url_resolver';
import {LpcFlashUtility} from './app';

enableProdMode();
disableDebugTools();

bootstrap(LpcFlashUtility, [ROUTER_PROVIDERS, provide(UrlResolver, {useClass: MyUrlResolver})]);
