import { IUser } from './IUser';

export default interface IAuth {
  User: IUser;
  Siginin(): void;
  Siginout(): void;
  Update(): void;
}
