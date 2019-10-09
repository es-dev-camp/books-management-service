import axios from 'axios';
import firebase from '@/firebase/firestore';
import IBook from '@common/IBook';
import { IGoogleBookInfo } from '@common/IGoogleBookInfo';
import { Timestamp } from '@common/Timestamp';

export default class Book implements IBook {
  public static async Init(isbn: string, userId: string) {
    try {
      const summary = await Book.GetBookInfo(isbn);
      if (!summary) {
        return undefined;
      }

      const book = {} as IBook;
      book.ISBN = isbn;
      book.Title = summary.title || '';
      book.Cover = summary.imageLinks ? summary.imageLinks.thumbnail : '';
      book.Authors = summary.authors || [];
      book.PublishDate = summary.publishedDate || '';
      book.Publisher = summary.publisher || '';
      book.Comment = summary.description || '';
      book.Modified = new Date();
      book.ModifiedUserId = userId;
      await Book.SetCreated(book);

      return book;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private static collectionName: string = 'book';
  private static collection: firebase.firestore.CollectionReference = firebase
    .firestore()
    .collection(Book.collectionName);

  private static async SetCreated(book: IBook) {
    const bookmeta = await Book.collection.doc(book.ISBN).get();

    if (bookmeta.exists) {
      const ref = bookmeta.data() as IBook;
      book.Created = ref.Created;
      book.CreatedUserId = ref.CreatedUserId;
    } else {
      book.Created = new Date();
      book.CreatedUserId = book.ModifiedUserId;
    }
  }

  private static async GetBookInfo(isbn: string) {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    const bookInfo = response.data as IGoogleBookInfo;
    if (bookInfo && bookInfo.totalItems > 0) {
      return bookInfo.items[0].volumeInfo;
    }
    console.warn('Not found book infomation.', isbn);
    return undefined;
  }

  public Title: string = '';
  public ISBN: string = '';
  public Cover: string = '';
  public Authors: string[] = [];
  public PublishDate: string = '';
  public Publisher: string = '';
  public Comment: string = '';
  public Created!: Date;
  public CreatedUserId: string | null = '';
  public Modified!: Date;
  public ModifiedUserId: string | null = '';
  public Location: string = '';
  public OnLoan: boolean | null = false;
  public LastBorrowUserId: string | null = '';
  public LastBorrowTimestamp: Timestamp | null = null;

  public get CreatedInfo(): string {
    if (this.Created === undefined) {
      return '';
    }
    // TODO: 日付型は Timestamp で扱うようにしたい
    const created = this.Created as any;
    if (!(created instanceof Date)) {
      this.Created = created.toDate();
    }
    return this.Created.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo'
    });
  }

  public get ModifiedInfo() {
    if (this.Modified === undefined) {
      return '';
    }
    // TODO: 日付型は Timestamp で扱うようにしたい
    const modified = this.Modified as any;
    if (!(modified instanceof Date)) {
      this.Modified = modified.toDate();
    }
    return this.Modified.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo'
    });
  }

  public async Save() {
    await Book.collection
      .doc(this.ISBN)
      .set(Object.assign({}, this) as Partial<IBook>);
  }

  public async Rent(userId: string) {
    // TODO: Partial<IBook> 型のデータを update() する
    return await Book.collection.doc(this.ISBN).update({
      OnLoan: true,
      LastBorrowUserId: userId,
      LastBorrowTimestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  public async Return() {
    await Book.collection.doc(this.ISBN).update({
      OnLoan: false
    } as Partial<IBook>);
  }
}
