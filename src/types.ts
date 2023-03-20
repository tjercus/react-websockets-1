import { Socket } from "socket.io-client";

export interface Identifiable {
  id: string;
}

export interface Valuable<T> {
  value: T;
}

export type IdentifyAndValuable<T> = Identifiable & Valuable<T>;
