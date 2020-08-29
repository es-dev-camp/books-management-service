import { Timestamp } from './Timestamp';

export type event = {
  id: string;
  user: string;
  ts: Timestamp;
  type: EventType;
};

export type bookEvent = event & {
  subtype: BookEventType;
  book: string;
};

export enum BookEventType {
  created = 'created',
  deleted = 'deleted',
  edited = 'edited',
  borrowed = 'borrowed',
  returned = 'returned',
}

export enum EventType {
  book = 'book',
}
