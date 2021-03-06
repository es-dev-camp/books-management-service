import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module';
import { IBook } from '@common/IBook';
import * as Books from '@/model/Books';

class BooksState {
  books: IBook[] = new Array<IBook>();
  currentBook: IBook = {} as IBook;
  filter = '';
}

class BooksGetters extends Getters<BooksState> {
  get getFilterdBooks() {
    const regex = new RegExp(`^.*${this.state.filter}.*$`, 'i');
    return this.state.books.filter(
      book =>
        regex.test(book.Title) ||
        regex.test(book.Comment) ||
        book.Authors.some(author => regex.test(author))
    );
  }
  get getFilter() {
    return this.state.filter;
  }
  get getCurrentBook() {
    return this.state.currentBook;
  }
}

class BooksMutations extends Mutations<BooksState> {
  async updateBooks() {
    this.state.books = await Books.getBooks();
  }
  async updateBook(ISBN: string) {
    const book = await Books.reloadBook(ISBN);
    if (!book) {
      return;
    }
    const currentBooks = this.state.books;
    const index = currentBooks.findIndex(x => x.ISBN === ISBN);
    this.state.books.splice(index, 1, book);
    this.setCurrentBook(book);
  }
  setFilter(filter: string) {
    this.state.filter = filter;
  }
  setCurrentBook(book: IBook) {
    this.state.currentBook = book;
  }
}

class BooksActions extends Actions<
  BooksState,
  BooksGetters,
  BooksMutations,
  BooksActions
> {
  updateList() {
    this.commit('updateBooks', null);
  }
  updateBook(ISBN: string) {
    this.commit('updateBook', ISBN);
  }
  setFilter(filter: string) {
    this.commit('setFilter', filter);
  }
  setCurrentBook(book: IBook) {
    this.commit('setCurrentBook', book);
  }
}

export const BooksModule = new Module({
  state: BooksState,
  getters: BooksGetters,
  mutations: BooksMutations,
  actions: BooksActions
});

export const BooksMapper = createMapper(BooksModule);
