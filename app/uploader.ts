import {Component, NgZone} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PROGRESSBAR_DIRECTIVES, Alert} from 'ng2-bootstrap';
import * as FlashMagic from 'flashmagic.js/lib';
import {FileDrop} from './file_drop';
import {ProgrammerState, setProgrammerState, Store} from './state';
const fs = require('fs'); // XXX

@Component({
  selector: 'uploader',
  styles: [`
    .drop-zone { height: 100% }
    .dragover { background: red }
    .container, .row { height: 100% }
  `],
  templateUrl: 'uploader.html',
  directives: [CORE_DIRECTIVES, FileDrop, PROGRESSBAR_DIRECTIVES, Alert]
})

export class Uploader {

  private state: ProgrammerState = ProgrammerState.IDLE;
  private uploadLength: number;
  private uploadCount: number;

  constructor(private ngZone: NgZone) {
    Store.subscribe(state => {
      this.state = Store.getState().programmer;
    });
  }

  private fileOver(e: FileList) {
    this.open()
      .then(isp => this.programFile(isp, e[0]['path'], 0))
      .then(isp => isp.close())
      .then(() => Store.dispatch(setProgrammerState(ProgrammerState.IDLE)))
      .catch(err => {
        Store.dispatch(setProgrammerState(ProgrammerState.FAILED));
        console.error(err);
      });
  }

  // Due to a node-serialport issue about file descriptor leak (open / close
  // problems), the default baud rate and initial baud rate are equal.
  private open(): Promise<FlashMagic.InSystemProgramming> {
    let state = Store.getState().flashmagic;
    let isp = new FlashMagic.InSystemProgramming(state.portPath, state.baudRate, state.cclk);
    Store.dispatch(setProgrammerState(ProgrammerState.SYNCING));
    isp.verbose = state.verbose;
    const hs = state.handshake;
    return isp.open().then(isp => FlashMagic.handshake(isp, hs.retryCount, hs.retryTimeout));
  }

  private programFile(isp: FlashMagic.InSystemProgramming, path: string, address: number): Promise<FlashMagic.InSystemProgramming> {
    Store.dispatch(setProgrammerState(ProgrammerState.FLASHING));
    this.uploadLength = fs.statSync(path).size;
    this.uploadCount = 0;
    let programmer = new FlashMagic.Programmer(isp, address, this.uploadLength);
    return new Promise<FlashMagic.InSystemProgramming>((resolve, reject) => {
      let stream = fs.createReadStream(path);
      programmer.program(stream)
        .on('start', () => console.log(`About to flash ${this.uploadLength} bytes...`))
        .on('chunk', buffer => {
          this.ngZone.runOutsideAngular(() => {
            this.uploadCount += buffer.length;
            this.ngZone.run(() => { });
          })
        })
        .on('error', error => reject(error))
        .on('end', () => {
          console.log(`${path}: ${this.uploadCount} bytes written`);
          stream.close();
          resolve(isp);
        });
    });
  }

}
