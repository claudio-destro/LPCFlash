import {NgFor} from 'angular2/common';
import {Component, NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
import {BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

import {setPortPath, setBaudRate, setCrystalClock, setEcho, State, Store} from './state';
let com = require('serialport');

@Component({
  selector: 'serial-port-chooser',
  styles: [`
    label:after { content: ":" }
  `],
  template: `
    <form class="form-horizontal">
      <fieldset class="form-group">
        <label class="control-label col-sm-3" for="portPath">Serial port</label>
        <div class="input-group col-sm-9">
          <div class="btn-group" dropdown>
            <button id="portPath" type="button" class="btn btn-success" dropdownToggle>
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
            <button id="baudRate" type="button" class="btn btn-success" dropdownToggle>
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
          <input [ngModel]="cclk" (ngModelChange)="crystalClockChange(cclk = $event)" type="number" class="form-control" id="cclk">
          <div class="input-group-addon">kHz</div>
        </div>
      </fieldset>
      <fieldset class="form-group">
        <label class="control-label col-sm-3" for="echo">Echo <em>{{ echo ? 'enabled' : 'disabled' }}</em></label>
        <div class="input-group col-sm-6">
          <div class="btn-group">
            <button type="button" class="btn btn-success" [(ngModel)]="echo" btnCheckbox>{{ echo ? 'Disable' : 'Enable' }}</button>
          </div>
        </div>
      </fieldset>
      <fieldset class="form-group">
        <label class="control-label col-sm-3" for="verbose">Verbose Mode</label>
        <div class="input-group col-sm-6">
          <div class="btn-group">
            <button type="button" class="btn btn-success" [(ngModel)]="verbose" btnCheckbox disabled="disabled">{{ verbose ? 'Enabled' : 'Disabled' }}</button>
          </div>
        </div>
      </fieldset>
    </form>
  `,
  directives: [NgFor, BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES]
})

export class SerialPortChooser {

  private portPath: string;
  private baudRate: number;
  private cclk: number;
  private echo: boolean;
  private verbose: boolean;

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
    this.verbose = state.verbose;
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
