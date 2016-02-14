import {Observable} from 'rxjs/Observable';
import {Component, EventEmitter, Input, NgZone, Output} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor} from 'angular2/common';

declare var require: any;
let com = require('serialport');

export interface SerialPortDescriptor {
  comPort: String;
  baudRate: Number;
}

@Component({
  selector: 'serial-port-chooser',
  template:
  `<form>
    <select [(ngModel)]="comPort">
      <option *ngFor="#port of ports" [value]="port">{{ port }}</option>
    </select>
    <select [(ngModel)]="baudRate">
      <option *ngFor="#rate of baudRates" [value]="rate">{{ rate }}</option>
    </select>
    <button class="btn" (click)="selectPort()" [disabled]="applyDisabled">Apply</button>
  </form>`,
  directives: [NgFor, FORM_DIRECTIVES]
})

export class SerialPortChooser {

  private comPort: string;
  private baudRate: number;

  @Output() changed: EventEmitter<SerialPortDescriptor> = new EventEmitter(true);

  private applyDisabled: boolean = false;

  baudRates: number[] = [110,300,600,1200,2400,4800,9600,14400,19200,28800,38400,56000,57600,115200,128000,153600,230400,256000,460800,921600];
  ports: string[] = [];

  constructor(private ngZone: NgZone) {
    this.comPort = localStorage.getItem('comPort');
    this.baudRate = +localStorage.getItem('baudRate');
    this.refreshPorts(() => {
      if (!this.comPort && this.ports.length) {
        this.comPort = this.ports[0];
      }
    });
  }

  selectPort(): void {
    localStorage.setItem('comPort', this.comPort);
    localStorage.setItem('baudRate', this.baudRate.toString(10));
    this.changed.emit({comPort: this.comPort, baudRate: this.baudRate});
  }

  refreshPorts(done: () => void): void {
    com.list((err: any, ports: {comName: string}[]) => {
      this.ngZone.runOutsideAngular(() => {
        this.ports = [];
        ports.forEach(port => this.ports.push(port.comName));
        this.ngZone.run(done);
      });
    });
  }

}

