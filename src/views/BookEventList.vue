<template>
  <v-container grid-list-xs fluid>
    <v-row>
      <v-col>
        <div v-for="(item, index) in getBookEventList" v-bind:key="index">
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
import { AuditModule } from "@/modules/AuditModule";
import { BooksModule } from "@/modules/BooksModule";
import { SignInModule } from "@/modules/SignInModule";
import { Users, getUser } from "@/model/Users";
import * as booksManagementEvent from "@common/booksManagementEvent";
import IBook from "@/model/IBook";
import BookDetail from "../components/BookDetail.vue";

const Super = Vue.extend({
  methods: {
    ...BooksModule.mapActions(["updateList", "setCurrentBook"]),
    ...AuditModule.mapActions(["updateBookEventList"])
  },
  computed: {
    ...BooksModule.mapGetters(["getFilterdBooks"]),
    ...AuditModule.mapGetters(["getBookEventList"]),
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
    await this.updateBookEventList();
  }

  convertUserName(userId: string): string {
    const user = getUser(userId);
    return user && user.displayName ? user.displayName : "不明な人物";
  }

  convertBookTitle(isbn: string): string {
    const books = this.getFilterdBooks;
    const findBooks = books.filter(x => x.ISBN === isbn);
    return !findBooks || findBooks.length === 0
      ? "不明な書籍"
      : findBooks[0].Title;
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
