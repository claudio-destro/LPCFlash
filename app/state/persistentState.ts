import {createStore, IReducer, IStore} from 'redux';
import {State} from './state';

const LOCALSTORAGE_KEY = 'lpcflash';
const serialize = JSON.stringify;
const deserialize = JSON.parse;

export function createPersistentStore(reducer: IReducer<State>, initialState: State): IStore<State> {
  let finalInitialState: State;

  try {
    let persistedState = deserialize(localStorage.getItem(LOCALSTORAGE_KEY));
    finalInitialState = Object.assign({}, initialState, persistedState);
  } catch (e) {
    console.warn(e);
  }

  const store = createStore(reducer, finalInitialState);

  store.subscribe(function() {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, serialize(store.getState()));
    } catch (e) {
      console.warn(e);
    }
  });

  return store;
}
