import {createPersistentStore} from './persistentState';
import {reducer} from './reducers';

export const Store = createPersistentStore(reducer, {
  portPath: null,
  baudRate: 115200,
  cclk: 12000,
  echo: true,
  verbose: true
});

export * from './actions';
export * from './State';
