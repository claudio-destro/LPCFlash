import {Observable} from 'rxjs/Observable';
import {Component, EventEmitter, Input, NgZone, Output} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor} from 'angular2/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {Router} from 'angular2/router';
import {} from 'angular2/event';

import {setPortPath, setBaudRate, setCrystalClock, setEcho, State, Store} from './state';
let com = require('serialport');

@Component({
  selector: 'serial-port-chooser',
  styles: [`
    .dropdown-item {cursor: pointer}
  `],
  template:
  `<form class="form-horizontal">
    <fieldset class="form-group">
      <label class="control-label col-sm-3" for="portPath">Serial port</label>
      <div class="input-group col-sm-9">
        <div class="btn-group" dropdown>
          <button id="portPath" type="button" class="btn btn-primary" dropdownToggle>
            {{ portPath || 'Choose serial port' }}
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu" aria-labelledby="portPath">
            <li role="menuitem">
              <a class="dropdown-item" *ngFor="#port of ports" (click)="portPathChange(port)">{{ port }}</a>
            </li>
          </ul>
        </div>
      </div>
    </fieldset>
    <fieldset class="form-group">
      <label class="control-label col-sm-3" for="baudRate">Baud rate</label>
      <div class="input-group col-sm-9">
        <div class="btn-group" dropdown>
          <button id="baudRate" type="button" class="btn btn-primary" dropdownToggle>
            {{ baudRate }}
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu" aria-labelledby="baudRate">
            <li role="menuitem">
              <a class="dropdown-item" *ngFor="#rate of baudRates" (click)="baudRateChange(rate)">{{ rate }}</a>
            </li>
          </ul>
        </div>
      </div>
    </fieldset>
    <fieldset class="form-group">
      <label class="control-label col-sm-3" for="cclk">Crystal clock</label>
      <div class="input-group col-sm-6">
        <input [ngModel]="cclk" (ngModelChange)="crystalClockChange(cclk = $event)" type="number" class="form-control" id="cclk"/>
        <div class="input-group-addon">kHz</div>
      </div>
    </fieldset>
  </form>`,
  directives: [NgFor, DROPDOWN_DIRECTIVES]
})

export class SerialPortChooser {

  private portPath: string;
  private baudRate: number;
  private cclk: number;
  private echo: boolean;

  private baudRates: number[] = [9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200];
  private ports: string[] = [];

  constructor(private _ngZone: NgZone) {
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

  private gatherState(state: State = Store.getState()): void {
    this.portPath = state.portPath;
    this.baudRate = state.baudRate;
    this.cclk = state.cclk;
    this.echo = state.echo;
  }

  private refreshPorts(done: () => void): void {
    com.list((err: any, ports: { comName: string }[]) => {
      this._ngZone.runOutsideAngular(() => {
        this.ports = [];
        ports.forEach(port => this.ports.push(port.comName));
        this._ngZone.run(done);
      });
    });
  }

}
