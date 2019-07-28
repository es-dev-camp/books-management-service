<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-card>
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

          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex xs4 sm3 md2 lg2 xl1 v-for='book in FilterdBooks' v-bind:key='book.ISBN'>
                <v-tooltip bottom>
                  <template v-slot:activator='{ on }'>
                    <v-img :src='book.Cover' dark v-on='on' @click='ShowDetail(book)' width='100%' height='100%'/>
                  </template>
                  <span>{{ book.Title }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-container>

          <v-dialog :value='isShowDetail' @input='isShowDetail = false'
            width='80%' max-width='700px'>
            <BookDetail :Book='selectedBook' @close-dialog='isShowDetail = false'></BookDetail>
          </v-dialog>

          <v-footer class='mt-5'></v-footer>
        </v-card>
      </v-flex>
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
