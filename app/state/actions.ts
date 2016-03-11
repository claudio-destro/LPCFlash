import {ProgrammableFile, ProgrammerState, HandshakeState} from './State';

export const SET_PORT_PATH = 'SET_PORT_PATH';
export const SET_BAUD_RATE = 'SET_BAUD_RATE';
export const SET_CCLK = 'SET_CCLK';
export const SET_ECHO = 'SET_ECHO';
export const SET_VERBOSE = 'SET_VERBOSE';
export const SET_HANDSHAKE = 'SET_HANDSHAKE';
export const SET_PROGRAMMER_STATE = 'SET_PROGRAMMER_STATE';
export const ADD_PROGRAMMABLE_FILE = 'ADD_PROGRAMMABLE_FILE';
export const REMOVE_PROGRAMMABLE_FILE = 'REMOVE_PROGRAMMABLE_FILE';

export interface Action { type: string; }
export interface PortPathAction extends Action { path: string; }
export interface BaudRateAction extends Action { rate: number; }
export interface CrystalClockAction extends Action { cclk: number; }
export interface EchoAction extends Action { echo: boolean; }
export interface VerboseAction extends Action { verbose: boolean; }
export interface HandshakeAction extends Action, HandshakeState { }
export interface ProgrammerStateAction extends Action { state: ProgrammerState }
export interface AddProgrammableAction extends Action, ProgrammableFile { }
export interface RemoveProgrammableAction extends Action { index: number }

export function setPortPath(path: string): PortPathAction {
  return { type: SET_PORT_PATH, path };
}

export function setBaudRate(rate: number): BaudRateAction {
  return { type: SET_BAUD_RATE, rate };
}

export function setCrystalClock(cclk: number): CrystalClockAction {
  return { type: SET_CCLK, cclk };
}

export function setEcho(echo: boolean): EchoAction {
  return { type: SET_ECHO, echo };
}

export function setVerbose(verbose: boolean): VerboseAction {
  return { type: SET_VERBOSE, verbose };
}

export function setHandshake(retryTimeout: number, retryCount: number): HandshakeAction {
  return { type: SET_HANDSHAKE, retryTimeout, retryCount };
}

export function setProgrammerState(state: ProgrammerState): ProgrammerStateAction {
  return { type: SET_PROGRAMMER_STATE, state };
}

export function addProgrammableFile(filePath: string, address: number = 0x2000): AddProgrammableAction {
  return { type: ADD_PROGRAMMABLE_FILE, filePath, address };
}

export function removeProgrammableFile(index: number): RemoveProgrammableAction {
  return { type: REMOVE_PROGRAMMABLE_FILE, index };
}
