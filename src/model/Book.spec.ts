import { getBook, saveBook, rentBook, returnBook } from './Book';
import axios, { AxiosInstance } from 'axios';

jest.mock('axios');
const myAxios: jest.Mocked<AxiosInstance> = axios as any;

describe('getBook', () => {
  test('存在しないISBNを指定すると、不明なタイトルの本オブジェクトが返ること', async () => {
    const empty = {
      status: 404
    };
    const mockGet = jest.fn().mockReturnValueOnce(empty);
    // @ts-ignore
    myAxios.get = mockGet;

    const book = await getBook('1234567890123', 'hoge');
    expect(book ? book.Title : '').toEqual('不明なタイトル');
  });
  test('存在するISBNを指定すると、適切なタイトルの本オブジェクトが返ること', async () => {
    const summary = {
      status: 200,
      data: {
        totalItems: 1,
        items: [
          {
            selfLink: 'https://hogefuga/'
          }
        ]
      }
    };
    const item = {
      status: 200,
      data: {
        volumeInfo: {
          title: 'hoge'
        }
      }
    };
    const mockGet = jest
      .fn()
      .mockReturnValueOnce(summary)
      .mockReturnValue(item);
    // @ts-ignore
    myAxios.get = mockGet;

    const book = await getBook('9876543210987', 'hoge');
    expect(book ? book.Title : '').toEqual('hoge');
  });
});

describe.skip('saveBook', () => {
  test('本の情報が保存されること', async () => {
    // arrange
    const isbn = '1234567890123';

    // action
    await saveBook({ ISBN: isbn, Title: 'hoge' });

    // assert
    const book = await getBook(isbn, 'testUser');
    expect(book ? book.Title : '').toEqual('hoge');
  });
});

describe.skip('rentBook', () => {
  test('本が貸出状態になること', async () => {
    // arrange
    const isbn = '1234567890123';
    const testUser = 'testUser';

    // action
    await saveBook({ ISBN: isbn, Title: 'hoge' });
    await rentBook(isbn, testUser);

    // assert
    const book = await getBook(isbn, testUser);
    expect(book ? book.OnLoan : undefined).toEqual(true);
  });
});

describe.skip('returnBook', () => {
  test('本の情報が保存されること', async () => {
    // arrange
    const isbn = '1234567890123';
    const testUser = 'testUser';

    // action
    await saveBook({ ISBN: isbn, Title: 'hoge' });
    await rentBook(isbn, testUser);
    await returnBook(isbn);

    // assert
    const book = await getBook(isbn, testUser);
    expect(book ? book.OnLoan : undefined).toEqual(false);
  });
});
