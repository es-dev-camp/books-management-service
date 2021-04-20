import firebase from '@/firebase/firestore';
import * as booksManagementEvent from '@common/booksManagementEvent';

export default class AuditLog {
  private static collectionName = 'audit';
  private static collection: firebase.firestore.CollectionReference = firebase
    .firestore()
    .collection(AuditLog.collectionName);

  public static async GetBookEventList(): Promise<any> {
    try {
      const bookEventQuery = AuditLog.collection.orderBy('ts', 'desc');

      const bookEventQuerySnapshot = await bookEventQuery.get();
      const bookEventList = new Array<booksManagementEvent.bookEvent>();
      bookEventQuerySnapshot.forEach(bookEvent => {
        const book = Object.assign(
          bookEvent.data()
        ) as booksManagementEvent.bookEvent;
        // TODO: collectionのwhere句を使う (要: indexの設定)
        if (book.type === booksManagementEvent.EventType.book) {
          bookEventList.push(book);
        }
      });
      return bookEventList;
    } catch (error) {
      console.error(error);
    }
  }
}
