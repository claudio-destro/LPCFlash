export const SET_PORT_PATH = 'SET_PORT_PATH';
export const SET_BAUD_RATE = 'SET_BAUD_RATE';
export const SET_CCLK = 'SET_CCLK';
export const SET_ECHO = 'SET_ECHO';
export const SET_VERBOSE = 'SET_VERBOSE';
export const SET_HANDSHAKE = 'SET_HANDSHAKE';

export interface Action { type: string; }
export interface PortPathAction extends Action { path: string; }
export interface BaudRateAction extends Action { rate: number; }
export interface CrystalClockAction extends Action { cclk: number; }
export interface EchoAction extends Action { echo: boolean; }
export interface VerboseAction extends Action { verbose: boolean; }
export interface HandshakeAction extends Action { retryTimeout: number; retryCount: number; }

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
