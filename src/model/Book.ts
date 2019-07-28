import axios from 'axios';
import firebase from '@/firebase/firestore';
import IBook from '@/model/IBook.ts';
import {Timestamp} from './Timestamp';

export default class Book implements IBook {

  public static async Init(isbn: string, userId: string): Promise<any> {
    try {
      const summary = await Book.GetBookInfo(isbn);
      if (summary === null) {
        return null;
      }

      const book = new Book();
      book.ISBN = isbn;
      book.Title = summary.title;
      if (summary.imageLinks !== undefined) {
        book.Cover = summary.imageLinks.thumbnail;
      } else {
        book.Cover = '';
      }

      if (summary.authors !== undefined) {
        book.Authors = summary.authors;
      }

      book.PublishDate = summary.publishedDate;
      if (summary.publisher !== undefined) {
        book.Publisher = summary.publisher;
      }

      if (summary.description !== undefined) {
        book.Comment = summary.description;
      }

      book.Modified = new Date();
      book.ModifiedUserId = userId;

      await Book.SetCreated(book);
      return book;
    } catch (error) {
      console.exception(error);
      return null;
    }
  }

  private static collectionName: string = 'book';
  private static collection: firebase.firestore.CollectionReference =
                              firebase.firestore().collection(Book.collectionName);

  private static async SetCreated(book: IBook): Promise<void> {
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

  private static async GetBookInfo(isbn: string): Promise<any> {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (response.data === undefined || response.data.totalItems === 0) {
      console.warn('Not found book infomation.', isbn);
      return null;
    }

    return response.data.items[0].volumeInfo;
  }

  public Title: string = '';
  public ISBN: string = '';
  public Cover: string = '';
  public Authors: string[] = new Array<string>();
  public PublishDate: string = '';
  public Publisher: string = '';
  public Comment: string = '';
  public Created!: Date;
  public CreatedUserId: string = '';
  public Modified!: Date;
  public ModifiedUserId: string = '';
  public Location: string = '';
  public OnLoan?: boolean = false;
  public LastBorrowUserId?: string = '';
  public LastBorrowTimestamp?: null | Timestamp = null;

  public get CreatedInfo(): string {
    if (this.Created === undefined) {
      return '';
    }

    const created = this.Created as any;
    if (!(created instanceof Date)) {
      this.Created = created.toDate();
    }
    return `${this.Created.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} --${this.CreatedUserId}`;
  }

  public get ModifiedInfo(): string {
    if (this.Modified === undefined) {
      return '';
    }

    const modified = this.Modified as any;
    if (!(modified instanceof Date)) {
      this.Modified = modified.toDate();
    }
    return `${this.Modified.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} --${this.ModifiedUserId}`;
  }

  public async Save(): Promise<any> {
    await Book.collection.doc(this.ISBN).set(Object.assign({}, this));
  }

  public async Rent(userId: string): Promise<void> {
    return await Book.collection.doc(this.ISBN).update({
      OnLoan: true,
      LastBorrowUserId: userId,
      LastBorrowTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
}
