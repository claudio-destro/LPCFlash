import {createPersistentStore} from './persistentState';
import {ProgrammerState} from './LPCFlashState';
import {reducer} from './reducers';

export const Store = createPersistentStore(reducer, {
  programmer: ProgrammerState.IDLE,
  flashmagic: {
    portPath: null,
    baudRate: 115200,
    cclk: 12000,
    echo: false,
    verbose: true,
    handshake: {
      retryTimeout: 20,
      retryCount: 1500
    }
  },
  history: [],
  alreadyOpen: false
});

export * from './actions';
export * from './LPCFlashState';
