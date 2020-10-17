<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="book in getFilterdBooks"
        :key="book.ISBN"
        d-flex
        cols="2"
        sm="2"
        md="1"
        lg="1"
        xl="1"
        class="ma-1"
      >
        <v-row align="center" justify="center">
          <v-img
            :src="book.Thumbnail"
            lazy-src="/img/noimage.png"
            style="cursor: pointer"
            aspect-ratio="0.7070"
            @click="ShowDetail(book)"
          />
        </v-row>
        <v-row align="center" justify="center" class="pa-2">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <span
                class="body-2 font-weight-light yt-ui-ellipsis rows-2"
                v-on="on"
                >{{ book.Title }}</span
              >
            </template>
            {{ book.Title }}
          </v-tooltip>
        </v-row>
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
import { VRow, VCol, VContainer, VImg, VTooltip, VDialog } from "vuetify/lib";
import { BooksMapper } from "@/modules/BooksModule";
import { SignInMapper } from "@/modules/SignInModule";
import { IBook } from "@common/IBook";
const BookDetail = () => import("@/components/BookDetail.vue");

const Super = Vue.extend({
  computed: {
    ...BooksMapper.mapGetters(["getFilterdBooks", "getCurrentBook"]),
    ...SignInMapper.mapGetters(["getUser"]),
  },
  methods: BooksMapper.mapActions(["updateList", "setCurrentBook"]),
});

@Component({
  components: {
    BookDetail,
    VRow,
    VCol,
    VContainer,
    VImg,
    VTooltip,
    VDialog,
  },
})
export default class BooksList extends Super {
  isShowDetail = false;

  async created() {
    await this.updateList();
  }

  ShowDetail(book: IBook): void {
    this.setCurrentBook(book);
    this.isShowDetail = true;
  }
}
</script>

<style scoped>
.yt-ui-ellipsis {
  background-color: #fff;
  display: block;
  line-height: 1.3em;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
}
.yt-ui-ellipsis::after {
  content: "\00a0 \00a0 \00a0 \00a0 \00a0 \00a0 \00a0";
  float: right;
  z-index: 999;
  position: relative;
  background: inherit;
}
.yt-ui-ellipsis::before {
  content: "\002026";
  right: 0;
  bottom: 0;
}
.yt-ui-ellipsis::before {
  background-color: inherit;
  position: absolute;
}
@supports (-webkit-line-clamp: 2) {
  .yt-ui-ellipsis {
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .yt-ui-ellipsis::before {
    content: "";
    position: static;
  }
  .yt-ui-ellipsis::after {
    float: none;
    content: "";
  }
}
.rows-1 {
  max-height: 1.3em;
}
.rows-2 {
  -webkit-line-clamp: 2;
  max-height: 2.6em;
}
.rows-3 {
  -webkit-line-clamp: 3;
  max-height: 3.9em;
}
</style>
