export enum ProgrammerState {
  FAILED = -1,
  IDLE = 0,
  OPENING = 1,
  SYNCING = 2,
  FLASHING = 3,
  CLOSING = 4
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

export interface ProgrammableFile {
  filePath: string;
  address: number;
}

export interface LPCFlashState {
  programmer: ProgrammerState;
  flashmagic: FlashMagicState;
  history: ProgrammableFile[];
}
