import * as Actions from './actions';
import {State} from './State';

export function reducer(state: State, action: Actions.Action) {
  switch (action.type) {
    case Actions.SET_PORT_PATH:
      state.portPath = (<Actions.PortPathAction>action).path;
      break;
    case Actions.SET_BAUD_RATE:
      state.baudRate = (<Actions.BaudRateAction>action).rate;
      break;
    case Actions.SET_CCLK:
      state.cclk = (<Actions.CrystalClockAction>action).cclk;
      break;
    case Actions.SET_ECHO:
      state.echo = (<Actions.EchoAction>action).echo;
      break;
    case Actions.SET_VERBOSE:
      state.verbose = (<Actions.VerboseAction>action).verbose;
      break;
    case Actions.SET_HANDSHAKE:
      state.handshake = {
        retryTimeout: (<Actions.HandshakeAction>action).retryTimeout,
        retryCount: (<Actions.HandshakeAction>action).retryCount,
      }
      break;
  }
  return state;
}
