export interface event {
  id: string;
  user: string;
  ts: Timestamp;
  type: EventType;
}

export interface bookEvent extends event {
  subtype: BookEventType;
  book: string;
}

export enum BookEventType {
  created = 'created',
  deleted = 'deleted',
  edited = 'edited',
  borrowed = 'borrowed',
  returned = 'returned'
}

export enum EventType {
  book = 'book'
}

export interface Timestamp {
  nanoseconds: number;
  seconds: number;
}
