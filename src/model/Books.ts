import firebase from '@/firebase/firestore';
import IBook from '@/model/IBook.ts';
import Book from './Book';

export default class Books {
  public static async GetList(): Promise<any> {
    try {
      const booklist = Books.collection.orderBy('Modified', 'desc');

      const booksmeta = await booklist.get();
      const books = new Array<IBook>();
      booksmeta.forEach((bookmeta) => {
        const book = Object.assign(new Book(), bookmeta.data());

        if (book.Cover.length === 0) {
          book.Cover = '/img/noimage.png';
        }
        books.push(book);
      });
      return books;
    } catch (error) {
      console.exception(error);
    }
  }

  private static collectionName: string = 'book';
  private static collection: firebase.firestore.CollectionReference =
                              firebase.firestore().collection(Books.collectionName);
}
