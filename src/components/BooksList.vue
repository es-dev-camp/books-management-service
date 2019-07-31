<template>
  <v-container fluid grid-list-xl>
    <v-layout align-start justify-start column >
      <v-container>
        <v-layout>
          <v-toolbar>
            <v-text-field prepend-icon='search'
                          placeholder='Search'
                          v-model='searchWords' />
            <v-spacer></v-spacer>
            <v-btn icon @click='UpdateList'>
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-toolbar>
        </v-layout>
      </v-container>

      <v-container grid-list-xs fluid>
        <v-layout align-start justify-start row wrap >
          <v-flex d-flex xs4 sm3 md2 lg2 xl1 v-for='book in FilterdBooks' v-bind:key='book.ISBN'>
            <div>
              <v-layout align-center justify-start column>
                <v-flex d-flex>
                  <img v-lazy='book.Cover' class="grey lighten-4" width="128px" height="166px" @click='ShowDetail(book)'/>
                </v-flex>
                <v-flex d-flex>
                  <span>{{ book.Title }}</span>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>

      <v-dialog :value='isShowDetail' @input='isShowDetail = false'
        width='80%' max-width='700px'>
        <BookDetail :Book='selectedBook' @close-dialog='isShowDetail = false'></BookDetail>
      </v-dialog>

      <v-footer class='mt-5'></v-footer>
    </v-layout>
  </v-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import BookDetail from './BookDetail.vue';
import IBook from '@/model/IBook';
import Book from '@/model/Book';
import Books from '@/model/Books';

@Component
({
  components: {
    BookDetail,
  },
})
export default class BooksList extends Vue {
  private isShowDetail: boolean = false;
  private selectedBook: IBook = new Book();

  private books: IBook[] = new Array<IBook>();
  private searchWords: string = '';

  private get Books(): IBook[] {
    return this.books;
  }

  private get FilterdBooks(): IBook[] {
    const regex = new RegExp(`^.*${this.searchWords}.*$`, 'i');
    return this.books.filter((book) =>
            regex.test(book.Title) ||
            regex.test(book.Comment) ||
            book.Authors.some((author) => regex.test(author)));
  }

  public created(): void {
    this.UpdateList();
  }

  public async UpdateList(): Promise<void> {
    this.books = await Books.GetList();
  }

  private ShowDetail(book: IBook): void {
    this.isShowDetail = true;
    this.selectedBook = book;
  }
}
</script>

<style scoped>
</style>
