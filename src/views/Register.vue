<template>
  <v-container fill-width fluid grid-list-xl>
    <v-layout row justify-center>
      <v-flex xs12 sm6>
        <v-text-field
          autofocus
          placeholder="Input ISBN-13 code, and Press Enter key."
          class="purple-input"
          v-model="isbn"
          v-on:keydown.enter="AddBook"
          style="ime-mode:inactive;"
        />
      </v-flex>
      <v-snackbar
        :top="snack.Top"
        :bottom="snack.Bottom"
        :left="snack.Left"
        :right="snack.Right"
        :color="snack.Color"
        v-model="snack.IsVisible"
        dark
      >
        <v-icon color="white" class="mr-3">mdi-bell-plus</v-icon>
        <div>{{ snack.Message }}</div>
        <v-icon size="16" @click="snack.IsVisible = false"
          >mdi-close-circle</v-icon
        >
      </v-snackbar>
    </v-layout>

    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-progress-linear :indeterminate="isBusy" />
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ registeredBook.Title }}
          </v-card-title>
          <v-list two-line>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">notes</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ registeredBook.Comment }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">publish</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ registeredBook.PublishDate }}
                </v-list-tile-title>
                <v-list-tile-sub-title>Published date</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">account_circle</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>
                  <template v-for="author in registeredBook.Authors">
                    <span bold v-bind:key="author"> {{ author }} </span>
                  </template>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">update</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ registeredBook.ModifiedInfo }}
                </v-list-tile-title>
                <v-list-tile-sub-title></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">fiber_new</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ registeredBook.CreatedInfo }}
                </v-list-tile-title>
                <v-list-tile-sub-title></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-img :src="registeredBook.Cover" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Book from "@/model/Book.ts";
import IBook from "@/model/IBook.ts";
import Snack from "@/model/Snack.ts";
import { BooksModule } from "@/modules/BooksModule";
import { SignInModule } from "@/modules/SignInModule";

const Super = Vue.extend({
  methods: BooksModule.mapActions(["updateList"]),
  computed: SignInModule.mapGetters(["getUser"])
});

@Component
export default class Register extends Super {
  isbn: string = "";
  isBusy: boolean = false;
  snack: Snack = new Snack();
  registeredBook: IBook = new Book();

  async AddBook(): Promise<void> {
    this.isBusy = true;

    if (this.isbn === "" || this.isbn.length !== 13) {
      this.ShowSnack("warning", "Invalid input for ISBN-13", ["top"]);
      this.ClearInput();
      return;
    }

    const book = (await Book.Init(this.isbn, this.getUser.Id)) as IBook;
    if (book === null) {
      this.ShowSnack("warning", `Not found book infomation ${this.isbn}`, [
        "top"
      ]);
      this.ClearInput();
      return;
    }

    console.log(book);

    try {
      await book.Save();
      this.registeredBook = book;
      await this.updateList();
      this.ShowSnack("success", "Successfull data save to FireStore.", ["top"]);
    } catch (error) {
      this.ShowSnack("error", "Failed save.", ["top"]);
      console.exception(error);
    } finally {
      this.ClearInput();
    }
  }

  ClearInput(): void {
    this.isbn = "";
    this.isBusy = false;
  }

  ShowSnack(color: string, message: string, args: string[]): void {
    this.snack.Show(color, message, args);
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
input {
  margin: 10px 0;
  padding: 10px;
}
</style>
