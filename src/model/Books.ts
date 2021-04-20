import firebase from '@/firebase/firestore';
import { IBook } from '@common/IBook';

const currentDb = firebase.firestore();
function collection(db: firebase.firestore.Firestore) {
  return db.collection('book');
}

export async function getBooks(db: firebase.firestore.Firestore = currentDb) {
  try {
    const booklist = collection(db).orderBy('Modified', 'desc');
    const booksRef = await booklist.get();
    return booksRef.docs.map(b => wrap(b.data()));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function reloadBook(
  ISBN: string,
  db: firebase.firestore.Firestore = currentDb
) {
  try {
    const bookSnapshot = await collection(db).doc(ISBN).get();
    const bookData = bookSnapshot.data();
    if (!bookData) {
      throw new Error('this Book data is null.');
    }
    return wrap(bookData);
  } catch (error) {
    console.error(error);
    return {} as IBook;
  }
}

function wrap(bookData: firebase.firestore.DocumentData) {
  const book = Object.assign({} as IBook, bookData);
  book.Cover = book.Cover || '/img/noimage.png';
  book.Thumbnail = book.Thumbnail || '/img/noimage.png';
  return book;
}
