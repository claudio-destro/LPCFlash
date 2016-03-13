import {InSystemProgramming} from 'flashmagic.js/lib';
import {FlashMagicState, Store} from '../state';

export interface IspProvider {
  get(state: FlashMagicState): Promise<InSystemProgramming>;
  unget(isp: InSystemProgramming): Promise<InSystemProgramming>;
}

// Due to some obsure node-serialport issues, we cannot close and open ports...
//
class IspSingleton implements IspProvider {

  private isp: InSystemProgramming = null;

  get(state: FlashMagicState): Promise<InSystemProgramming> {
    if (this.isp) {
      return Promise.resolve(this.isp.reset());
    }
    this.isp = new InSystemProgramming(state.portPath, state.baudRate, state.cclk);
    this.isp.verbose = state.verbose;
    return this.isp.open()
      .then(isp => {
        console.info(`InSystemProgramming["${state.portPath}",${state.baudRate}]`);
        return isp;
      })
      .catch(error => {
        this.isp = null;
        throw error;
      });
  }

  unget(isp: InSystemProgramming): Promise<InSystemProgramming> {
    return Promise.resolve(this.isp.reset());
  }
}

// class IspFactory implements IspProvider {
//
//   get(state: FlashMagicState): Promise<InSystemProgramming> {
//     let isp = new InSystemProgramming(state.portPath, state.baudRate, state.cclk);
//     isp.verbose = state.verbose;
//     return isp.open();
//   }
//
//   unget(isp: InSystemProgramming): Promise<InSystemProgramming> {
//     return isp.close();
//   }
// }

const strategy: IspProvider = new IspSingleton();

export function getIspProvider(): IspProvider { return strategy; }
