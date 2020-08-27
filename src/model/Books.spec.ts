import * as Books from './Books';
import FirestoreTestProvider from '../../tests/FirestoreTestProvider';
import { IBook } from '@common/IBook';

const provider = new FirestoreTestProvider('test-book');
const existBookIsbn = '1234512345123';
let db: firebase.firestore.Firestore;
beforeAll(async () => {
  const adminDB = provider.getAdminFirestore();
  await adminDB.doc(`book/${existBookIsbn}`).set({
    ISBN: existBookIsbn,
    Title: 'existBook',
    OnLoan: false,
    Modified: new Date('2020-01-01'),
  } as IBook);
  db = provider.getFirestoreWithAuth({
    uid: 'testuid',
  });
});
afterAll(async () => {
  await db.disableNetwork();
  await provider.cleanup();
});

describe('getBooks', () => {
  test('書籍データが1件返ること', async () => {
    const books = await Books.getBooks(db);
    expect(books.length).toEqual(1);
  });
  test('例外が発生したときは書籍データが返らないこと', async () => {
    const books = await Books.getBooks({} as firebase.firestore.Firestore);
    expect(books.length).toEqual(0);
  });
});
describe('reloadBook', () => {
  test('書籍データが1件返ること', async () => {
    const books = await Books.reloadBook(existBookIsbn, db);
    expect(books.Title).toEqual('existBook');
  });
});
