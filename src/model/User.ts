import firebase from '@/firebase/firestore';

export default class User {
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
  private static collection: firebase.firestore.CollectionReference =
                              firebase.firestore().collection(User.collectionName);

  public IsSignin: boolean = false;
  public Name: string | null = 'Anonymous';
  public Id: string = '';
  public Email: string | null = '';
  public ImageUrl: string | null = '/img/anonymous.png';
}
