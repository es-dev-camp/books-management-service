import firebase from '@/firebase/firestore';
import IUser from '@/model/IUser';

export default class User implements IUser {
  public static async GetName(userId: string): Promise<string> {
    try {
      const meta = await this.collection.doc(userId).get();
      const user = meta.data();
      if (user === undefined) {
        return 'UnKnown';
      }
      return user.name;
    } catch (ex) {
      console.error(ex);
    }
    return 'UnKnown';
  }

  private static collectionName: string = 'user';
  private static collection: firebase.firestore.CollectionReference = firebase
    .firestore()
    .collection(User.collectionName);

  public displayName: string | null = 'Anonymous';
  public Id: string = '';
  public Email: string | null = '';
  public photoURL: string | null = '/img/anonymous.png';

  public static async GetUserList(): Promise<any> {
    try {
      const userQuery = User.collection;

      const userQuerySnapshot = await userQuery.get();
      const userList = new Array<IUser>();
      userQuerySnapshot.forEach(async userSnap => {
        const user = Object.assign(new User(), userSnap.data()) as IUser;
        userList.push(user);
      });
      return userList;
    } catch (error) {
      console.error(error);
    }
  }
}
