export interface State {
  portPath: string;
  baudRate: number;
  cclk: number;
  echo: boolean;
  verbose: boolean;
  handshake: {
    retryTimeout: number,
    retryCount: number
  };
}
