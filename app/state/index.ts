import {createPersistentStore} from './persistentState';
import {reducer} from './reducers';
import {ProgrammerState} from './State';

export const Store = createPersistentStore(reducer, {
  programmer: ProgrammerState.IDLE,
  flashmagic: {
    portPath: null,
    baudRate: 115200,
    cclk: 12000,
    echo: true,
    verbose: true,
    handshake: {
      retryTimeout: 20,
      retryCount: 1500
    }
  }
});

export * from './actions';
export * from './State';
