<template>
  <v-container grid-list-xs fluid>
    <v-layout align-start justify-start row wrap>
      <v-flex
        d-flex
        xs4
        sm3
        md2
        lg2
        xl1
        v-for="book in getFilterdBooks"
        v-bind:key="book.ISBN"
      >
        <v-layout align-center justify-start column>
          <v-flex d-flex>
            <img
              v-lazy="book.Cover"
              class="grey lighten-4"
              width="128px"
              height="166px"
              @click="ShowDetail(book)"
            />
          </v-flex>
          <v-flex d-flex>
            <span>{{ book.Title }}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-dialog
      :value="isShowDetail"
      @input="isShowDetail = false"
      width="80%"
      max-width="700px"
    >
      <BookDetail @close-dialog="isShowDetail = false"></BookDetail>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BooksModule } from "@/modules/BooksModule";
import IBook from "@/model/IBook";
import Book from "@/model/Book";
import BookDetail from "../components/BookDetail.vue";

const Super = Vue.extend({
  methods: BooksModule.mapActions(["updateList", "setCurrentBook"])
});

@Component({
  components: { BookDetail },
  computed: BooksModule.mapGetters(["getFilterdBooks"])
})
export default class BooksList extends Super {
  isShowDetail: boolean = false;

  async created() {
    await this.updateList();
  }

  ShowDetail(book: IBook): void {
    this.setCurrentBook(book);
    this.isShowDetail = true;
  }
}
</script>

<style scoped></style>
