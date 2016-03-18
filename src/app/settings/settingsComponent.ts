import {NgFor} from 'angular2/common';
import {Component, NgZone, OnDestroy} from 'angular2/core';
import {Router} from 'angular2/router';
import {BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {setPortPath, setBaudRate, setCrystalClock, setEcho, setHandshake, setVerbose, FlashMagicState, LPCFlashState, ProgrammerState, Store} from '../state';
import {TimespanPipe} from './timespanPipe';
let com = require('serialport');

@Component({
  selector: 'settings',
  pipes: [TimespanPipe],
  styles: [`
    label:after {content: ":"}
    .row {display: flex; align-items: center}
  `],
  template: require('./settings.html'),
  directives: [NgFor, BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES]
})

export class SettingsComponent implements OnDestroy {

  private portPath: string;
  private baudRate: number;
  private cclk: number;
  private echo: boolean;
  private verbose: boolean;
  private retryTimeout: number;
  private retryCount: number;
  private alreadyOpen: boolean;

  private baudRates: number[] = [9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200];
  private ports: string[] = [];

  private unsubscribe = () => { };

  constructor(private ngZone: NgZone) {
    this.unsubscribe = Store.subscribe(state => this.gatherState(state));
    this.gatherState();
    this.refreshPorts(() => {
      if (!this.portPath && this.ports.length) {
        this.portPath = this.ports[0];
        Store.dispatch(setPortPath(this.portPath));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
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

  private retryTimeoutChange(retryTimeout: number): void {
    Store.dispatch(setHandshake(retryTimeout, this.retryCount));
  }

  private retryCountChange(retryCount: number): void {
    Store.dispatch(setHandshake(this.retryTimeout, retryCount));
  }

  private echoChange(echo: boolean): void {
    Store.dispatch(setEcho(echo));
  }

  private verboseChange(verbose: boolean): void {
    Store.dispatch(setVerbose(verbose));
  }

  private gatherState(state: LPCFlashState = Store.getState()): void {
    const fm = state.flashmagic;
    this.portPath = fm.portPath;
    this.baudRate = fm.baudRate;
    this.cclk = fm.cclk;
    this.echo = fm.echo;
    this.verbose = fm.verbose;
    this.retryTimeout = fm.handshake.retryTimeout;
    this.retryCount = fm.handshake.retryCount;
    this.alreadyOpen = state.alreadyOpen;
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
