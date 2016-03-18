import {AfterViewChecked, Component, ElementRef, Input, NgZone, OnChanges, SimpleChange} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Log} from './log';

let com = require('serialport');

interface SerialPort {
  close(callback: () => void);
  on(event: String, callback: (a?: any) => void);
}

class NullSerialPort implements SerialPort {
  close(cb) { setTimeout(cb); }
  on(ev, cb) { }
}

@Component({
  selector: 'log-console',
  styles: [`
    ol {
      position: absolute;
      width: 100%;
      height: 100%;
      list-style-type: none;
      overflow: auto;
      padding: 0;
      margin: 0;
    }
    li {
      font-family: monospace;
      white-space: pre;
      font-size: 10pt;
    }
  `],
  template: `<ol><li *ngFor="#log of logs">{{ log.message }}</li></ol>`,
  directives: [NgFor]
})

export class LogConsole implements AfterViewChecked, OnChanges {

  @Input() comPort: String;
  @Input() baudRate: Number = 115200;
  @Input() maxLines: Number = 50;

  private scrollToBottom: Boolean = false;
  private sp: SerialPort = new NullSerialPort;
  public logs: Log[] = [];

  constructor(private ngZone: NgZone, private elementRef: ElementRef) {
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (changes['comPort'] || changes['baudRate']) {
      this.sp.close(() => {
        let sp = this.sp = this.makeSerialPort();
        sp.on('data', (data) => {
          this.ngZone.runOutsideAngular(() => {
            this.scrollToBottom = this.setScrollToBottom();
            this.addLog(data.toString());
            this.ngZone.run(() => {});
          });
        });
      });
    }
  }

  ngAfterViewChecked() {
    if (this.scrollToBottom) {
      this.elementRef.nativeElement.firstChild.scrollTop = 10000000;
      this.scrollToBottom = false;
    }
  }

  private setScrollToBottom(): Boolean {
    let raw = this.elementRef.nativeElement.firstChild; // ol
    return raw.scrollTop + raw.offsetHeight >= raw.scrollHeight;
  }

  private makeSerialPort(): SerialPort {
    try {
      return new com.SerialPort(
        this.comPort, {
          baudRate: this.baudRate,
          parser: com.parsers.readline('\r\n')
        }, true, (error: any) => {
          if (error) {
            console.error(error);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
    return new NullSerialPort;
  }

  private addLog(data: String): void {
    while (this.logs.length >= this.maxLines) {
      this.logs.shift();
    }
    this.logs.push({ message: data.toString() });
  }

}

