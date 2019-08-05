import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import IBook from '@/model/IBook';
import Books from '@/model/Books';

class BooksState {
    books: IBook[] = new Array<IBook>();
    filter: string = '';
}

class BooksGetters extends Getters<BooksState> {
    get getFilterdBooks() {
      const regex = new RegExp(`^.*${this.state.filter}.*$`, 'i');
      return this.state.books.filter(book =>
        regex.test(book.Title) ||
        regex.test(book.Comment) ||
        book.Authors.some((author) => regex.test(author))
      );
    }
    get getFilter() {
      return this.state.filter;
    }
}

class BooksMutations extends Mutations<BooksState> {
  async updateBooks() {
      this.state.books = await Books.GetList();;
  }
  setFilter(filter: string) {
    this.state.filter = filter;
  }
}

class BooksActions extends Actions<
    BooksState,
    BooksGetters,
    BooksMutations,
    BooksActions
> {

  async updateList() {
    await this.commit('updateBooks', null);
  }
  setFilter(filter: string) {
    this.commit('setFilter', filter);
  }
}

export const BooksModule = new Module({
  state: BooksState,
  getters: BooksGetters,
  mutations: BooksMutations,
  actions: BooksActions
});
