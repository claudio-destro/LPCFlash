import {Component, View, enableProdMode} from 'angular2/core';
import {disableDebugTools} from 'angular2/platform/browser';
import {LogConsole} from './log_console';
import {SerialPortDescriptor, SerialPortChooser} from './serial_port_chooser';

@Component({
    selector: 'lpc-flash-utility',
    template: `
    	<serial-port-chooser [comPort]="comPort" [baudRate]="baudRate" (changed)="onComChanged($event)"></serial-port-chooser>
    	<log-console [comPort]="comPort" [baudRate]="baudRate"></log-console>`,
    directives: [LogConsole, SerialPortChooser]
})

export class AppComponent {
	comPort: String = '';
	baudRate: Number = 115200;

	onComChanged(data: SerialPortDescriptor) {
		this.comPort = data.comPort;
		this.baudRate = data.baudRate;
	}
}

enableProdMode();
disableDebugTools();
