import {Component, EventEmitter, Input, NgZone, Output} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor} from 'angular2/common';

let com = require('serialport');

export interface SerialPortDescriptor {
  comPort: String;
  baudRate: Number;
}

@Component({
  selector: 'serial-port-chooser',
  template:
  `<form>
    <select (click)="refreshPorts()" [(ngModel)]="comPort">
      <option *ngFor="#port of ports" [value]="port">{{ port }}</option>
    </select>
    <select [(ngModel)]="baudRate">
      <option>110</option>
      <option>300</option>
      <option>600</option>
      <option>1200</option>
      <option>2400</option>
      <option>4800</option>
      <option>9600</option>
      <option>14400</option>
      <option>19200</option>
      <option>28800</option>
      <option>38400</option>
      <option>56000</option>
      <option>57600</option>
      <option>115200</option>
      <option>128000</option>
      <option>153600</option>
      <option>230400</option>
      <option>256000</option>
      <option>460800</option>
      <option>921600</option>
    </select>
    <button class="btn" (click)="selectPort()">Apply</button>
  </form>`,
  directives: [NgFor, FORM_DIRECTIVES]
})

export class SerialPortChooser {

  @Input() comPort: String;
  @Input() baudRate: Number;

  @Output() changed: EventEmitter<SerialPortDescriptor> = new EventEmitter(true);

  ports: String[] = [];

  constructor(private ngZone: NgZone) {
    this.refreshPorts();
  }

  selectPort(): void {
    this.changed.emit({comPort: this.comPort, baudRate: this.baudRate});
  }

  refreshPorts(): void {
    com.list((err: any, ports: {comName: string}[]) => {
      this.ngZone.runOutsideAngular(() => {
        this.ports = [];
        (ports || []).forEach((port) => {
          this.ports.push(port.comName);
        });
        console.log(this.ports);
        this.ngZone.run(() => {});
      });
    });
  }

}

