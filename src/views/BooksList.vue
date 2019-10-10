<template>
  <v-container fluid>
    <v-row>
      <v-col
        d-flex
        cols="4"
        sm="3"
        md="2"
        lg="2"
        xl="1"
        v-for="book in getFilterdBooks"
        v-bind:key="book.ISBN"
      >
        <v-row align="center" justify="center">
          <img
            v-lazy="book.Cover"
            class="grey lighten-4"
            style="cursor: pointer;"
            width="128px"
            height="166px"
            @click="ShowDetail(book)"
          />
        </v-row>
        <v-row align="center" justify="center">
          <span>{{ book.Title }}</span>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      :value="isShowDetail"
      @input="isShowDetail = false"
      width="80%"
      max-width="700px"
    >
      <BookDetail
        @close-dialog="isShowDetail = false"
        :CurrentUser="getUser"
      ></BookDetail>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BooksModule } from "@/modules/BooksModule";
import { SignInModule } from "@/modules/SignInModule";
import IBook from "@common/IBook";
import Book from "@/model/Book";
import BookDetail from "@/components/BookDetail.vue";

const Super = Vue.extend({
  methods: BooksModule.mapActions(["updateList", "setCurrentBook"])
});

@Component({
  components: { BookDetail },
  computed: {
    ...BooksModule.mapGetters(["getFilterdBooks"]),
    ...SignInModule.mapGetters(["getUser"])
  }
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
