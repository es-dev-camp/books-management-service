import firebase from '@/firebase/firestore';
import { IUser, userCollectionName } from './IUser';

export class Users {
  static cache: IUser[] = [];
  static unsub: () => void = () => {};

  static get list(): IUser[] {
    return Users.cache;
  }

  static sub() {
    const collection = firebase.firestore().collection(userCollectionName);
    Users.unsub = collection.onSnapshot(
      snapshot => {
        const users: IUser[] = [];
        snapshot.forEach(j => {
          users.push(j.data() as IUser);
        });
        Users.cache = users;
      },
      err => {
        console.log(`Error(Users): ${err}`);
      }
    );
  }
}

export function getUser(userId: string) {
  if (Users.cache && Users.cache.length > 0) {
    return Users.cache.find(u => u.Id === userId);
  }
  return undefined;
}

export function unsub() {
  Users.unsub();
}

Users.sub();
