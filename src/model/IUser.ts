export interface IUser {
  Id: string;
  Email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const userCollectionName: string = 'user';
