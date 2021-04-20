import axios from 'axios';
import firebase from '@/firebase/firestore';
import { IBook } from '@common/IBook';
import { IGoogleBookInfo, Item, VolumeInfo } from '@common/IGoogleBookInfo';

const currentDb = firebase.firestore();

function refillBook(book: VolumeInfo | undefined) {
  if (!book) return;
  book.title = book.title ?? '';
  book.authors = book.authors ?? [];
  book.publishedDate = book.publishedDate ?? '';
  book.publisher = book.publisher ?? '';
  book.description = book.description ?? '';

  if (!book.imageLinks) {
    book.imageLinks = {
      thumbnail: '',
      large: ''
    } as any;
    return book;
  }
  book.imageLinks.thumbnail = book.imageLinks.thumbnail.replace(
    'http://',
    'https://'
  );
  book.imageLinks.large =
    book.imageLinks.large.replace('http://', 'https://') ||
    book.imageLinks.thumbnail;
  return book;
}

async function getBookSummary(isbn: string): Promise<VolumeInfo | undefined> {
  const response = await axios.get<IGoogleBookInfo | undefined>(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );

  const bookInfo = response.data;
  if (!bookInfo || bookInfo.totalItems === 0) {
    return undefined;
  }

  const bookData = await axios.get<Item>(bookInfo.items[0].selfLink);
  if (bookData.status !== 200) {
    return undefined;
  }
  return refillBook(bookData.data.volumeInfo);
}

async function getBookInfo(
  isbn: string,
  userId: string
): Promise<Partial<IBook>> {
  const summary = await getBookSummary(isbn);
  if (!summary) {
    return {
      ISBN: isbn,
      Title: '不明なタイトル',
      Authors: ['不明な著者'],
      Created: new Date(),
      CreatedUserId: userId,
      Modified: new Date(),
      ModifiedUserId: userId
    };
  }

  return {
    ISBN: isbn,
    Title: summary.title,
    Thumbnail: summary.imageLinks.thumbnail,
    Cover: summary.imageLinks.large,
    Authors: summary.authors,
    PublishDate: summary.publishedDate,
    Publisher: summary.publisher,
    Comment: summary.description,
    Created: new Date(),
    CreatedUserId: userId,
    Modified: new Date(),
    ModifiedUserId: userId
  };
}

export async function getBook(
  isbn: string,
  userId: string,
  db: firebase.firestore.Firestore = currentDb
): Promise<Partial<IBook> | undefined> {
  try {
    const bookmeta = await db.doc(`book/${isbn}`).get();
    return bookmeta.exists
      ? (bookmeta.data() as IBook)
      : getBookInfo(isbn, userId);
  } catch (err) {
    return undefined;
  }
}

export async function saveBook(
  payload: Partial<IBook>,
  db: firebase.firestore.Firestore = currentDb
): Promise<void> {
  await db
    .doc(`book/${payload.ISBN}`)
    .set(Object.assign({}, payload) as Partial<IBook>, {
      merge: true
    });
}

export async function rentBook(
  isbn: string,
  userId: string,
  db: firebase.firestore.Firestore = currentDb
): Promise<void> {
  // TODO: Partial<IBook> 型のデータを update() する
  await db.doc(`book/${isbn}`).update({
    OnLoan: true,
    LastBorrowUserId: userId,
    LastBorrowTimestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export async function returnBook(
  isbn: string,
  db: firebase.firestore.Firestore = currentDb
): Promise<void> {
  await db.doc(`book/${isbn}`).update({
    OnLoan: false
  } as Partial<IBook>);
}
