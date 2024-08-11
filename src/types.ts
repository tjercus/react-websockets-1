export interface Identifiable {
  id: string;
}

export interface Valuable<T> {
  value: T;
}

export type IdentifiableAndValuable<T> = Identifiable & Valuable<T>;
