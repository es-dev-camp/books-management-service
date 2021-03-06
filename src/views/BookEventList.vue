<template>
  <v-container grid-list-xs fluid>
    <v-row>
      <v-col>
        <div v-for="(item, index) in getBookEventList" :key="index">
          <v-card
            v-if="convertBookTitle(item.book) !== '不明な書籍'"
            class="pa-2 ma-2"
          >
            <v-container class="pa-0 ma-0" justify-start>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  xs="12"
                  sm="2"
                  md="2"
                  lg="1"
                  xl="1"
                  class="pa-1"
                >
                  {{ item.ts | displayDate }}
                </v-col>
                <v-col
                  cols="12"
                  xs="12"
                  sm="10"
                  md="10"
                  lg="11"
                  xl="11"
                  class="pa-1"
                >
                  {{ convertUserName(item.user) }} が
                  <span class="primary--text" @click="ShowDetail(item.book)">
                    {{ convertBookTitle(item.book) }}
                  </span>
                  を {{ convertOperationStr(item.subtype) }}
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      :value="isShowDetail"
      width="80%"
      max-width="700px"
      @input="isShowDetail = false"
    >
      <book-detail
        :current-book="getCurrentBook"
        :current-user="getUser"
        @close-dialog="isShowDetail = false"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuditMapper } from "@/modules/AuditModule";
import { BooksMapper } from "@/modules/BooksModule";
import { SignInMapper } from "@/modules/SignInModule";
import { getUser } from "@/model/Users";
import { IBook } from "@common/IBook";
const BookDetail = () =>
  import(/* webpackChunkName: "book-detail"*/ "@/components/BookDetail.vue");

const Super = Vue.extend({
  computed: {
    ...BooksMapper.mapGetters(["getFilterdBooks", "getCurrentBook"]),
    ...AuditMapper.mapGetters(["getBookEventList"]),
    ...SignInMapper.mapGetters(["getUser"])
  },
  methods: {
    ...BooksMapper.mapActions(["updateList", "setCurrentBook"]),
    ...AuditMapper.mapActions(["updateBookEventList"])
  }
});

@Component({
  components: {
    BookDetail
  }
})
export default class BooksList extends Super {
  isShowDetail = false;

  async created() {
    await this.updateList();
    await this.updateBookEventList();
  }

  convertUserName(userId: string): string {
    const user = getUser(userId);
    return user && user.displayName ? user.displayName : "不明な人物";
  }

  convertBookTitle(isbn: string) {
    const books = this.getFilterdBooks;
    const book = books.find(x => x.ISBN === isbn);
    return book ? book.Title : "不明な書籍";
  }

  convertOperationStr(subtype: string): string {
    switch (subtype) {
      case "created":
        return "追加しました";
      case "deleted":
        return "削除しました";
      case "edited":
        return "編集しました";
      case "borrowed":
        return "借りました";
      case "returned":
        return "返却しました";
      default:
        return "(不明な操作ログです)";
    }
  }

  ShowDetail(isbn: string): void {
    const books = this.getFilterdBooks as IBook[];
    const findBooks = books.filter(x => x.ISBN === isbn);
    if (!findBooks || findBooks.length === 0) {
      return;
    }
    this.setCurrentBook(findBooks[0]);
    this.isShowDetail = true;
  }
}
</script>

<style scoped>
.primary--text {
  font-weight: bold;
}
.primary--text:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
