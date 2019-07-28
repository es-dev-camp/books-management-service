import User from './User';

export default interface IAuth {
  User: User;
  Siginin(): void;
  Siginout(): void;
  Update(): void;
}
