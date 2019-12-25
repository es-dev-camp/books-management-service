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
          <v-img
            :src="book.Thumbnail"
            lazy-src="/img/noimage.png"
            class="grey lighten-4 mx-4"
            style="cursor: pointer;"
            max-width="128px"
            max-height="166px"
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
      <book-detail
        @close-dialog="isShowDetail = false"
        :current-book="getCurrentBook"
        :current-user="getUser"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BooksModule } from "@/modules/BooksModule";
import { SignInModule } from "@/modules/SignInModule";
import IBook from "@common/IBook";
import BookDetail from "@/components/BookDetail.vue";

const Super = Vue.extend({
  methods: BooksModule.mapActions(["updateList", "setCurrentBook"]),
  computed: {
    ...BooksModule.mapGetters(["getFilterdBooks", "getCurrentBook"]),
    ...SignInModule.mapGetters(["getUser"])
  }
});

@Component({
  components: { BookDetail }
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
