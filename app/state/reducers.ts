import * as Actions from './actions';
import {State} from './State';

export function reducer(state: State, action: Actions.Action) {
  switch (action.type) {
    case Actions.SET_PORT_PATH:
      state.flashmagic.portPath = (<Actions.PortPathAction>action).path;
      break;
    case Actions.SET_BAUD_RATE:
      state.flashmagic.baudRate = (<Actions.BaudRateAction>action).rate;
      break;
    case Actions.SET_CCLK:
      state.flashmagic.cclk = (<Actions.CrystalClockAction>action).cclk;
      break;
    case Actions.SET_ECHO:
      state.flashmagic.echo = (<Actions.EchoAction>action).echo;
      break;
    case Actions.SET_VERBOSE:
      state.flashmagic.verbose = (<Actions.VerboseAction>action).verbose;
      break;
    case Actions.SET_HANDSHAKE:
      state.flashmagic.handshake = {
        retryTimeout: (<Actions.HandshakeAction>action).retryTimeout,
        retryCount: (<Actions.HandshakeAction>action).retryCount,
      }
      break;
    case Actions.SET_PROGRAMMER_STATE:
      state.programmer = (<Actions.ProgrammerStateAction>action).state;
      break;
  }
  return state;
}
