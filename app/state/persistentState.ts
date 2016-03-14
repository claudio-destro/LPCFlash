import {createStore, IReducer, IStore} from 'redux';
import {LPCFlashState, ProgrammerState} from './LPCFlashState';

const LOCALSTORAGE_KEY = 'lpcflash';
const serialize = JSON.stringify;
const deserialize = JSON.parse;

export function createPersistentStore(reducer: IReducer<LPCFlashState>, initialState: LPCFlashState): IStore<LPCFlashState> {
  let finalInitialState: LPCFlashState;

  try {
    let persistedState = deserialize(localStorage.getItem(LOCALSTORAGE_KEY));
    finalInitialState = Object.assign({}, initialState, persistedState);
  } catch (e) {
    console.warn(e);
  }

  finalInitialState.programmer = ProgrammerState.IDLE;

  const store = createStore(reducer, finalInitialState);

  store.subscribe(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, serialize(store.getState()));
    } catch (e) {
      console.warn(e);
    }
  });

  return store;
}
