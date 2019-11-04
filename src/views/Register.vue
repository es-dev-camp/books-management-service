<template>
  <v-container>
    <v-row align="center" justify="center" class="my-10">
      <v-col cols="12" sm="6">
        <v-text-field
          autofocus
          placeholder="1234567890123"
          hint="Input ISBN-13 code, and Press Enter key."
          persistent-hint
          class="purple-input"
          label="ISBN Code"
          v-model="isbn"
          v-on:keydown.enter="AddBook"
          style="ime-mode:inactive;"
        />
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-progress-linear :indeterminate="isBusy" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ registeredBook.Title }}
          </v-card-title>
          <v-list two-line>
            <v-list-item>
              <v-list-item-action>
                <v-icon color="indigo">notes</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ registeredBook.Comment }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon color="indigo">publish</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ registeredBook.PublishDate }}
                </v-list-item-title>
                <v-list-item-subtitle>Published date</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon color="indigo">account_circle</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  <template v-for="author in registeredBook.Authors">
                    <span bold v-bind:key="author"> {{ author }} </span>
                  </template>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon color="indigo">update</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ registeredBook.Modified | localDate }} --
                  {{ convertUserName(registeredBook.ModifiedUserId) }}
                </v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon color="indigo">fiber_new</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ registeredBook.Created | localDate }} --
                  {{ convertUserName(registeredBook.CreatedUserId) }}
                </v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-img :src="registeredBook.Cover" />
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getBook, saveBook } from "@/model/Book";
import IBook from "@common/IBook";
import Snack from "@/model/Snack.ts";
import { getUser } from "@/model/Users";
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
  registeredBook: IBook = {} as IBook;

  async AddBook(): Promise<void> {
    this.isBusy = true;

    if (this.isbn === "" || this.isbn.length !== 13) {
      this.ShowSnack("warning", "Invalid input for ISBN-13");
      this.ClearInput();
      return;
    }

    const book = await getBook(this.isbn, this.getUser.Id);
    if (!book) {
      this.ShowSnack("warning", `Not found book infomation ${this.isbn}`, [
        "top"
      ]);
      this.ClearInput();
      return;
    }

    console.log(book);

    try {
      await saveBook(book);
      this.registeredBook = book;
      await this.updateList();
      this.ShowSnack("success", "Successfull data save to FireStore.");
    } catch (error) {
      this.ShowSnack("error", "Failed save.");
      console.error(error);
    } finally {
      this.ClearInput();
    }
  }

  ClearInput(): void {
    this.isbn = "";
    this.isBusy = false;
  }

  convertUserName(userId: string) {
    const user = getUser(userId);
    return user && user.displayName ? user.displayName : "";
  }

  ShowSnack(color: string, message: string, args: string[] = ["top"]): void {
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
