import {InSystemProgramming} from 'flashmagic.js/lib';
import {FlashMagicState, Store} from './state';

const SYNCHRONIZED = 'Synchronized';
const SYNC_REGEXP = new RegExp(`^\\?*${SYNCHRONIZED}`);

export function interruptibleHandshake(isp: InSystemProgramming) {
  const cfg = Store.getState().flashmagic;
  let count = cfg.handshake.retryCount;
  let running = true;
  return {
    interrupt: () => {
      running = false;
    },
    promise: new Promise<InSystemProgramming>((resolve, reject) => {
      console.log(`Sync'ing...`);
      (function synchronize() {
        isp.write('?')
          .then(() => isp.read(cfg.handshake.retryTimeout))
          .then(ack => {
            if (!ack.match(SYNC_REGEXP)) {
              throw new RangeError('Not synchronized');
            }
            return isp.writeln(SYNCHRONIZED);
          })
          .then(isp => isp.assert(SYNCHRONIZED))
          .then(isp => isp.assert('OK'))
          .then(isp => isp.sendLine(isp.cclk.toString(10)))
          .then(isp => isp.assert('OK'))
          .then(isp => isp.setEcho(cfg.echo))
          .then(isp => isp.readPartIdentification())
          .then(partId => isp.readBootcodeVersion())
          .then(bootVer => resolve(isp))
          .catch(error => {
            if (running) {
              if (count-- <= 0) {
                return reject(error);
              }
              setTimeout(synchronize);
            }
          });
      })(); // start loop, until no error
    })
  }
}
