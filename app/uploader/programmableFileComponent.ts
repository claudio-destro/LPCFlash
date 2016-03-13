import {Component, Input, NgZone} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PROGRESSBAR_DIRECTIVES} from 'ng2-bootstrap';
import {InSystemProgramming, Programmer} from 'flashmagic.js/lib';
import {ProgrammableFile, FlashMagicState, ProgrammerState, removeProgrammableFile, setProgrammerState, setProgrammableFileAddress, Store} from '../state';
import {HexInputComponent} from './hexInputComponent';
import {getIspProvider} from './ispProvider';
import * as fs from 'fs';

@Component({
  selector: 'programmableFile',
  styles: [`
    .flashmagic-state-opening,
    .flashmagic-state-synching {
      align-items: center;
      display: flex;
    }
    .flashmagic-state>div[class^="col-"]{
      padding-right: 0;
    }
  `],
  templateUrl: 'uploader/programmableFile.html',
  directives: [HexInputComponent, CORE_DIRECTIVES, PROGRESSBAR_DIRECTIVES]
})

export class ProgrammableFileComponent implements ProgrammableFile {

  @Input() index: number;
  @Input() filePath: string;
  @Input() address: number;

  status = ProgrammerState.IDLE;
  uploadLength: number;
  uploadCount: number;
  blocked = false;
  invalidAddress = false;

  constructor(private ngZone: NgZone) {
    Store.subscribe(state => {
      this.blocked = Store.getState().programmer > 0;
    });
  }

  addressChange(): void {
    this.invalidAddress = isNaN(this.address);
    if (!this.invalidAddress) {
      Store.dispatch(setProgrammableFileAddress(this.index, this.address));
    }
  }

  setStatus(status: ProgrammerState): void {
    Store.dispatch(setProgrammerState(status));
    this.status = status;
  }

  downloadFile(): void {
    let state = Store.getState().flashmagic;
    this.setStatus(ProgrammerState.OPENING);
    getIspProvider().get(state)
      .then(isp => {
        this.setStatus(ProgrammerState.SYNCING);
        return this.handshake(isp);
      })
      .then(isp => {
        this.setStatus(ProgrammerState.FLASHING);
        return this.programFile(isp);
      })
      .then(isp => {
        this.setStatus(ProgrammerState.CLOSING);
        return getIspProvider().unget(isp);
      })
      .then(isp => {
        this.setStatus(ProgrammerState.IDLE);
        return isp;
      })
      .catch(err => {
        this.setStatus(ProgrammerState.FAILED);
        console.error(err);
      });
  }

  remove(): void {
    Store.dispatch(removeProgrammableFile(this.index));
  }

  private handshake(isp: InSystemProgramming) {
    const cfg = Store.getState().flashmagic;
    let count = cfg.handshake.retryCount;
    this.uploadCount = this.uploadLength = 1;
    return new Promise<InSystemProgramming>((resolve, reject) => {
      var synchronize = () => {
        isp.write('?')
          .then(() => isp.assert(/^\?*Synchronized/, cfg.handshake.retryTimeout))
          .then(isp => isp.writeln('Synchronized'))
          .then(isp => isp.assert(/Synchronized/))
          .then(isp => isp.assertOK())
          .then(isp => isp.sendLine(isp.cclk.toString(10)))
          .then(isp => isp.assertOK())
          .then(isp => isp.setEcho(cfg.echo))
          .then(isp => isp.readPartIdentification())
          .then(partId => isp.readBootcodeVersion())
          .then(bootVer => resolve(isp))
          .catch(error => {
            if (this.status === ProgrammerState.SYNCING) {
              if (count-- <= 0) {
                return reject(error);
              }
              console.error(error);
              setTimeout(synchronize); // loop until error or interrupt
            }
          });
      };
      synchronize(); // start loop
    });
  }

  private programFile(isp: InSystemProgramming): Promise<InSystemProgramming> {
    this.uploadCount = 0;
    this.uploadLength = fs.statSync(this.filePath).size;
    let programmer = new Programmer(isp, this.address, this.uploadLength);
    return new Promise<InSystemProgramming>((resolve, reject) => {
      let stream = fs.createReadStream(this.filePath);
      programmer.program(stream)
        .on('start', () => { })
        .on('chunk', buffer => {
          if (this.status === ProgrammerState.FLASHING) {
            this.ngZone.runOutsideAngular(() => {
              this.uploadCount += buffer.length;
              this.ngZone.run(() => { });
            });
          }
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
