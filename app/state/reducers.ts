import * as Actions from './actions';
import {LPCFlashState} from './LPCFlashState';

export function reducer(state: LPCFlashState, action: Actions.Action) {
  switch (action.type) {
    case Actions.SET_PORT_PATH:
      state.flashmagic.portPath = (<Actions.SetPortPathAction>action).path;
      break;
    case Actions.SET_BAUD_RATE:
      state.flashmagic.baudRate = (<Actions.SetBaudRateAction>action).rate;
      break;
    case Actions.SET_CCLK:
      state.flashmagic.cclk = (<Actions.SetCrystalClockAction>action).cclk;
      break;
    case Actions.SET_ECHO:
      state.flashmagic.echo = (<Actions.SetEchoAction>action).echo;
      break;
    case Actions.SET_VERBOSE:
      state.flashmagic.verbose = (<Actions.SetVerboseAction>action).verbose;
      break;
    case Actions.SET_HANDSHAKE:
      state.flashmagic.handshake = {
        retryTimeout: (<Actions.SetHandshakeAction>action).retryTimeout,
        retryCount: (<Actions.SetHandshakeAction>action).retryCount,
      }
      break;
    case Actions.SET_PROGRAMMER_STATE:
      state.programmer = (<Actions.SetProgrammerStateAction>action).state;
      break;
    case Actions.ADD_PROGRAMMABLE_FILE:
      state.history.unshift({
        filePath: (<Actions.AddProgrammableFileAction>action).filePath,
        address: (<Actions.AddProgrammableFileAction>action).address,
      });
      break;
    case Actions.SET_PROGRAMMABLE_FILE_ADDRESS:
      let p = state.history[(<Actions.SetProgrammableFileAddressAction>action).index];
      p.address = (<Actions.SetProgrammableFileAddressAction>action).address;
      break;
    case Actions.REMOVE_PROGRAMMABLE_FILE:
      state.history.splice((<Actions.RemoveProgrammableFileAction>action).index, 1);
      break;
  }
  return state;
}
