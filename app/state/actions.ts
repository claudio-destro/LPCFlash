import {ProgrammableFile, ProgrammerState, HandshakeState} from './LPCFlashState';

export const SET_PORT_PATH = 'SET_PORT_PATH';
export const SET_BAUD_RATE = 'SET_BAUD_RATE';
export const SET_CCLK = 'SET_CCLK';
export const SET_ECHO = 'SET_ECHO';
export const SET_VERBOSE = 'SET_VERBOSE';
export const SET_HANDSHAKE = 'SET_HANDSHAKE';
export const SET_PROGRAMMER_STATE = 'SET_PROGRAMMER_STATE';
export const ADD_PROGRAMMABLE_FILE = 'ADD_PROGRAMMABLE_FILE';
export const SET_PROGRAMMABLE_FILE_ADDRESS = 'SET_PROGRAMMABLE_FILE_ADDRESS';
export const REMOVE_PROGRAMMABLE_FILE = 'REMOVE_PROGRAMMABLE_FILE';

export interface Action { type: string; }
export interface SetPortPathAction extends Action { path: string; }
export interface SetBaudRateAction extends Action { rate: number; }
export interface SetCrystalClockAction extends Action { cclk: number; }
export interface SetEchoAction extends Action { echo: boolean; }
export interface SetVerboseAction extends Action { verbose: boolean; }
export interface SetHandshakeAction extends Action, HandshakeState { }
export interface SetProgrammerStateAction extends Action { state: ProgrammerState }
export interface AddProgrammableFileAction extends Action, ProgrammableFile { }
export interface SetProgrammableFileAddressAction extends Action { index: number; address: number }
export interface RemoveProgrammableFileAction extends Action { index: number; }

export function setPortPath(path: string): SetPortPathAction {
  return { type: SET_PORT_PATH, path };
}

export function setBaudRate(rate: number): SetBaudRateAction {
  return { type: SET_BAUD_RATE, rate };
}

export function setCrystalClock(cclk: number): SetCrystalClockAction {
  return { type: SET_CCLK, cclk };
}

export function setEcho(echo: boolean): SetEchoAction {
  return { type: SET_ECHO, echo };
}

export function setVerbose(verbose: boolean): SetVerboseAction {
  return { type: SET_VERBOSE, verbose };
}

export function setHandshake(retryTimeout: number, retryCount: number): SetHandshakeAction {
  return { type: SET_HANDSHAKE, retryTimeout, retryCount };
}

export function setProgrammerState(state: ProgrammerState): SetProgrammerStateAction {
  return { type: SET_PROGRAMMER_STATE, state };
}

export function addProgrammableFile(filePath: string, address: number = 0x2000): AddProgrammableFileAction {
  return { type: ADD_PROGRAMMABLE_FILE, filePath, address };
}

export function setProgrammableFileAddress(index: number, address: number): SetProgrammableFileAddressAction {
  return { type: SET_PROGRAMMABLE_FILE_ADDRESS, index, address };
}

export function removeProgrammableFile(index: number): RemoveProgrammableFileAction {
  return { type: REMOVE_PROGRAMMABLE_FILE, index };
}
