export type ID = string;
export type Name = string;

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type ServerType =
  | ClientToServerEvents
  | ServerToClientEvents
  | InterServerEvents
  | SocketData;

export type User = {
  id: ID;
  identified: boolean;
  value: string;
};
