import {NgFor} from 'angular2/common';
import {Component, NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
import {BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {setPortPath, setBaudRate, setCrystalClock, setEcho, setHandshake, State, Store} from './state';
let com = require('serialport');

@Component({
  selector: 'serial-port-chooser',
  styles: [`
    label:after {content: ":"}
    .rowspan {padding: 32px 64px}
  `],
  templateUrl: 'settings.html',
  directives: [NgFor, BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES]
})

export class Settings {

  private portPath: string;
  private baudRate: number;
  private cclk: number;
  private echo: boolean;
  private verbose: boolean;
  private retryTimeout: number;
  private retryCount: number;

  private baudRates: number[] = [9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200];
  private ports: string[] = [];

  constructor(private ngZone: NgZone) {
    Store.subscribe(state => this.gatherState(state));
    this.gatherState();
    this.refreshPorts(() => {
      if (!this.portPath && this.ports.length) {
        this.portPath = this.ports[0];
        Store.dispatch(setPortPath(this.portPath));
      }
    });
  }

  private portPathChange(port: string): void {
    Store.dispatch(setPortPath(port));
  }

  private baudRateChange(rate: number): void {
    Store.dispatch(setBaudRate(rate));
  }

  private crystalClockChange(cclk: number): void {
    Store.dispatch(setCrystalClock(cclk));
  }

  private echoChange(echo: boolean): void {
    Store.dispatch(setEcho(echo));
  }

  private retryTimeoutChange(retryTimeout: number): void {
    Store.dispatch(setHandshake(retryTimeout, this.retryCount));
  }

  private retryCountChange(retryCount: number): void {
    Store.dispatch(setHandshake(this.retryTimeout, retryCount));
  }

  private gatherState(state: State = Store.getState()): void {
    this.portPath = state.portPath;
    this.baudRate = state.baudRate;
    this.cclk = state.cclk;
    this.echo = state.echo;
    this.verbose = state.verbose;
    this.retryTimeout = state.handshake.retryTimeout;
    this.retryCount = state.handshake.retryCount;
  }

  private refreshPorts(done: () => void): void {
    com.list((err: any, ports: { comName: string }[]) => {
      this.ngZone.runOutsideAngular(() => {
        this.ports = [];
        ports.forEach(port => this.ports.push(port.comName));
        this.ngZone.run(done);
      });
    });
  }

}
