import firebase from '@/firebase/firestore';
import { IBook } from '@common/IBook';

export default class Books {
  public static async GetList(): Promise<any> {
    try {
      const booklist = Books.collection.orderBy('Modified', 'desc');

      const booksmeta = await booklist.get();
      const books = new Array<IBook>();
      booksmeta.forEach((bookmeta) => {
        books.push(this.Wrap(bookmeta.data()));
      });
      return books;
    } catch (error) {
      console.error(error);
    }
  }

  public static async ReloadBook(ISBN: string): Promise<IBook | null> {
    let book: IBook | null = null;
    try {
      const bookSnapshot = await Books.collection.doc(ISBN).get();
      const bookData = bookSnapshot.data();
      if (!bookData) {
        throw new Error('this Book data is null.');
      }
      book = this.Wrap(bookData);
    } catch (error) {
      console.error(error);
    }
    return book;
  }

  private static Wrap(bookData: firebase.firestore.DocumentData): IBook {
    const book = Object.assign({} as IBook, bookData);
    book.Cover = book.Cover || '/img/noimage.png';
    book.Thumbnail = book.Thumbnail || '/img/noimage.png';
    return book;
  }

  private static collectionName = 'book';
  private static collection: firebase.firestore.CollectionReference = firebase
    .firestore()
    .collection(Books.collectionName);
}
