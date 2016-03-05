import {Component, NgZone} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PROGRESSBAR_DIRECTIVES, Alert} from 'ng2-bootstrap';
import {handshake, InSystemProgramming, Programmer} from 'flashmagic.js/lib';
import {FileDrop} from './file_drop';
import {FlashMagicState, ProgrammerState, setProgrammerState, Store} from './state';
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
    let state = Store.getState().flashmagic;
    const hs = state.handshake;
    this.open(state)
      .then(isp => {
        Store.dispatch(setProgrammerState(ProgrammerState.SYNCING));
        return handshake(isp, hs.retryCount, hs.retryTimeout);
      })
      .then(isp => {
        Store.dispatch(setProgrammerState(ProgrammerState.FLASHING));
        return this.programFile(isp, e[0]['path'], 0);
      })
      .then(isp => {
        Store.dispatch(setProgrammerState(ProgrammerState.IDLE));
        return isp.setEcho(true);
      })
      .catch(err => {
        Store.dispatch(setProgrammerState(ProgrammerState.FAILED));
        console.error(err);
      });
  }

  private isp: InSystemProgramming;

  private open(state: FlashMagicState): Promise<InSystemProgramming> {
    if (this.isp) {
      return Promise.resolve(this.isp);
    }
    this.isp = new InSystemProgramming(state.portPath, state.baudRate, state.cclk);
    this.isp.verbose = state.verbose;
    return this.isp.open();
  }

  private programFile(isp: InSystemProgramming, path: string, address: number): Promise<InSystemProgramming> {
    this.uploadLength = fs.statSync(path).size;
    this.uploadCount = 0;
    let programmer = new Programmer(isp, address, this.uploadLength);
    return new Promise<InSystemProgramming>((resolve, reject) => {
      let stream = fs.createReadStream(path);
      programmer.program(stream)
        .on('start', () => { })
        .on('chunk', buffer => {
          this.ngZone.runOutsideAngular(() => {
            this.uploadCount += buffer.length;
            this.ngZone.run(() => { });
          })
        })
        .on('error', error => {
          stream.close();
          reject(error);
        })
        .on('end', () => {
          stream.close();
          resolve(isp);
        });
    });
  }

}
