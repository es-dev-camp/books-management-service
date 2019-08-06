import firebase from '@/firebase/firestore';
import IAuth from './IAuth';
import User from './User';

export default class FirebaseAuth implements IAuth {
  public User: User = new User();

  public Siginin(): void {
    this.Update();
  }

  public async Siginout(): Promise<void> {
    try {
      await firebase.auth().signOut();

      console.info('Successfull Firebase signout.');
      this.User = new User();
    } catch (ex) {
      console.exception(ex);
    }
  }

  public Update(): void {
    const currentUser = firebase.auth().currentUser;
    if (currentUser === null) {
      this.User = new User();
      return;
    }

    this.User = {
      IsSignin: true,
      Name: currentUser.displayName,
      Id: currentUser.uid,
      Email: currentUser.email,
      ImageUrl: currentUser.photoURL
    };
  }
}
