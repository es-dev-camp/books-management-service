import { getBook, saveBook, rentBook, returnBook } from './Book';
import axios, { AxiosInstance } from 'axios';
import FirestoreTestProvider from '../../tests/FirestoreTestProvider';
import { IBook } from '@common/IBook';

jest.mock('axios');
const myAxios: jest.Mocked<AxiosInstance> = axios as any;

const provider = new FirestoreTestProvider('test-book');
const existBookIsbn = '1234512345123';
const testUser = 'testUser';
let db: any;
beforeAll(async () => {
  const adminDB = provider.getAdminFirestore();
  await adminDB.doc(`book/${existBookIsbn}`).set({
    ISBN: existBookIsbn,
    Title: 'existBook',
    OnLoan: false,
  } as IBook);
  db = provider.getFirestoreWithAuth({
    uid: 'testuid',
  });
});
afterAll(async () => {
  await db.disableNetwork();
  await provider.cleanup();
});

describe('getBook', () => {
  test('存在しないISBNを指定すると、不明なタイトルの本オブジェクトが返ること', async () => {
    const empty = {
      status: 404,
    };
    const mockGet = jest.fn().mockReturnValueOnce(empty);
    // @ts-ignore
    myAxios.get = mockGet;

    const book = await getBook('1234567890123', 'hoge', db);
    expect(book?.Title).toEqual('不明なタイトル');
  });
  test('存在するISBNを指定すると、適切なタイトルの本オブジェクトが返ること', async () => {
    const summary = {
      status: 200,
      data: {
        totalItems: 1,
        items: [
          {
            selfLink: 'https://hogefuga/',
          },
        ],
      },
    };
    const item = {
      status: 200,
      data: {
        volumeInfo: {
          title: 'hoge',
        },
      },
    };
    const mockGet = jest
      .fn()
      .mockReturnValueOnce(summary)
      .mockReturnValue(item);
    // @ts-ignore
    myAxios.get = mockGet;

    const book = await getBook('9876543210987', 'hoge', db);
    expect(book?.Title).toEqual('hoge');
  });
  test('DBに存在するISBNを指定すると、適切なタイトルの本オブジェクトが返ること', async () => {
    const mockGet = jest.fn().mockReturnValue(undefined);
    // @ts-ignore
    myAxios.get = mockGet;

    const book = await getBook(existBookIsbn, 'hoge', db);
    expect(book?.Title).toEqual('existBook');
  });
});

describe.skip('saveBook', () => {
  test('本のコメントが更新されること', async () => {
    const comment = 'hoge';
    await saveBook({ ISBN: existBookIsbn, Comment: comment }, db);

    const book = await getBook(existBookIsbn, 'testUser', db);
    expect(book?.Comment).toEqual(comment);
  });
});

describe.skip('rentBook', () => {
  test('本が貸出状態になること', async () => {
    await rentBook(existBookIsbn, testUser, db);

    const book = await getBook(existBookIsbn, testUser, db);
    expect(book?.OnLoan).toEqual(true);
  });
});

describe.skip('returnBook', () => {
  test('本が返却状態になること', async () => {
    await rentBook(existBookIsbn, testUser, db);
    await returnBook(existBookIsbn, db);

    const book = await getBook(existBookIsbn, testUser, db);
    expect(book?.OnLoan).toEqual(false);
  });
});
