export interface Identifiable {
  id: string;
}

export interface Valuable<T> {
  value: T;
}

export type IdentifiableAndValuable<T> = Identifiable & Valuable<T>;

export type Token = { token: string };

export type ServerCommand = { type: string; payload: unknown };
