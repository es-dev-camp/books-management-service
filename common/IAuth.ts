import { IUser } from './IUser';

export type IAuth = {
  User: IUser;
  Siginin(): void;
  Siginout(): void;
  Update(): void;
};
