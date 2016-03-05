export enum ProgrammerState {
  FAILED = -1,
  IDLE = 0,
  SYNCING = 1,
  FLASHING = 2,
}

export interface HandshakeState {
  retryTimeout: number;
  retryCount: number;
}

export interface FlashMagicState {
  portPath: string;
  baudRate: number;
  cclk: number;
  echo: boolean;
  verbose: boolean;
  handshake: HandshakeState;
}

export interface State {
  programmer: ProgrammerState;
  flashmagic: FlashMagicState;
}
