import * as fs from 'fs';
import {handshake, InSystemProgramming, Programmer} from 'flashmagic.js/lib';
import {FlashMagicState, Store} from './state';

let isp: InSystemProgramming;

export function open(state: FlashMagicState): Promise<InSystemProgramming> {
  if (this.isp) {
    return Promise.resolve(this.isp);
  }
  this.isp = new InSystemProgramming(state.portPath, state.baudRate, state.cclk);
  this.isp.verbose = state.verbose;
  return this.isp.open();
}

export function programFile(isp: InSystemProgramming, path: string, address: number): Promise<InSystemProgramming> {
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
