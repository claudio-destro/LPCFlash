import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from 'angular2/common';
import * as FlashMagic from 'flashmagic.js/lib';
import {FileDrop} from './file_drop';
import {Store} from './state';

@Component({
  selector: 'uploader',
  styles: [`
    .drop-zone { height: 300px }
    .dragover { background: red }
  `],
  templateUrl: 'uploader.html',
  directives: [FileDrop]
})

export class Uploader {

  private fileOver(e: FileList) {
    this.open()
      .then(isp => FlashMagic.handshake(isp))
      .then(isp => isp.close());
  }

  // Due to a node-serialport issue about file descriptor leak (open / close
  // problems), the default baud rate and initial baud rate are equal.
  private open(): Promise<FlashMagic.InSystemProgramming> {
    let state = Store.getState();
    let isp = new FlashMagic.InSystemProgramming(state.portPath, state.baudRate, state.cclk);
    isp.verbose = state.verbose;
    return isp.open().then(isp =>
      FlashMagic.handshake(isp,
        state.handshake.retryTimeout,
        state.handshake.retryCount));
  }

}
