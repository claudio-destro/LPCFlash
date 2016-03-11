import {Component, Input, NgZone} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PROGRESSBAR_DIRECTIVES} from 'ng2-bootstrap';
import {InSystemProgramming, Programmer} from 'flashmagic.js/lib';
import {ProgrammableFile, FlashMagicState, ProgrammerState, setProgrammerState, Store, removeProgrammableFile} from './state';
import * as fs from 'fs';

@Component({
  selector: 'programmableFile',
  styles: [`
    .flashmagic-opening,
    .flashmagic-synching {
      display: flex;
      align-items: center;
    }
  `],
  templateUrl: 'programmable_file.html',
  directives: [CORE_DIRECTIVES, PROGRESSBAR_DIRECTIVES]
})

export class BinaryFile implements ProgrammableFile {

  @Input() index: number;
  @Input() filePath: string;
  @Input() address: number;

  private status: ProgrammerState = ProgrammerState.IDLE;
  private uploadLength: number;
  private uploadCount: number;
  private blocked: boolean;

  constructor(private ngZone: NgZone) {
    Store.subscribe(state => {
      this.blocked = Store.getState().programmer > 0;
    });
  }

  private setStatus(status: ProgrammerState): void {
    Store.dispatch(setProgrammerState(status));
    this.status = status;
  }

  private downloadFile(): void {
    let state = Store.getState().flashmagic;
    this.setStatus(ProgrammerState.OPENING);
    this.open(state)
      .then(isp => {
        this.setStatus(ProgrammerState.SYNCING);
        return this.handshake(isp);
      })
      .then(isp => {
        this.setStatus(ProgrammerState.FLASHING);
        return this.programFile(isp);
      })
      .then(() => {
        this.setStatus(ProgrammerState.CLOSING);
      })
      .then(() => {
        this.setStatus(ProgrammerState.IDLE);
      })
      .catch(err => {
        this.setStatus(ProgrammerState.FAILED);
        console.error(err);
      });
  }

  private remove(): void {
    Store.dispatch(removeProgrammableFile(this.index));
  }

  private open(state: FlashMagicState): Promise<InSystemProgramming> {
    let isp = new InSystemProgramming(state.portPath, state.baudRate, state.cclk);
    isp.verbose = state.verbose;
    return isp.open();
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
          .then(isp => isp.reset())
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
