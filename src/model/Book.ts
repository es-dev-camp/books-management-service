import axios from 'axios';
import firebase from '@/firebase/firestore';
import IBook from '@common/IBook';
import { IGoogleBookInfo, Item, VolumeInfo } from '@common/IGoogleBookInfo';

const collectionName = 'book';
const collection = firebase.firestore().collection(collectionName);

async function getBookSummary(isbn: string): Promise<VolumeInfo | undefined> {
  const response = await axios.get<IGoogleBookInfo>(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );

  const bookInfo = response.data;
  if (!bookInfo || bookInfo.totalItems === 0) {
    console.warn('Not found book infomation.', isbn);
    return undefined;
  }

  const bookData = await axios.get<Item>(bookInfo.items[0].selfLink);
  if (bookData.status !== 200) {
    console.warn('Not found book infomation(selfLink).', isbn);
    return undefined;
  }
  return bookData.data.volumeInfo;
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

  const thumbnail =
    summary.imageLinks && summary.imageLinks.thumbnail
      ? summary.imageLinks.thumbnail.replace('http://', 'https://')
      : '';
  const cover =
    summary.imageLinks && summary.imageLinks.large
      ? summary.imageLinks.large.replace('http://', 'https://')
      : thumbnail;

  return {
    ISBN: isbn,
    Title: summary.title || '',
    Thumbnail: thumbnail,
    Cover: cover,
    Authors: summary.authors || [],
    PublishDate: summary.publishedDate || '',
    Publisher: summary.publisher || '',
    Comment: summary.description || '',
    Created: new Date(),
    CreatedUserId: userId,
    Modified: new Date(),
    ModifiedUserId: userId
  };
}

export async function getBook(
  isbn: string,
  userId: string
): Promise<Partial<IBook> | undefined> {
  try {
    const bookmeta = await collection.doc(isbn).get();
    return bookmeta.exists ? bookmeta.data() : await getBookInfo(isbn, userId);
  } catch (err) {
    return undefined;
  }
}

export async function saveBook(payload: Partial<IBook>): Promise<void> {
  await collection
    .doc(payload.ISBN)
    .set(Object.assign({}, payload), { merge: true });
}

export async function rentBook(isbn: string, userId: string): Promise<void> {
  // TODO: Partial<IBook> 型のデータを update() する
  return await collection.doc(isbn).update({
    OnLoan: true,
    LastBorrowUserId: userId,
    LastBorrowTimestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export async function returnBook(isbn: string): Promise<void> {
  await collection.doc(isbn).update({ OnLoan: false });
}
