<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      {{ currentBook.Title }}
      <v-spacer></v-spacer>
      <v-text-field
        v-if="isEditMode"
        v-model="currentBook.Location"
        class="px-1"
        label="location"
      />
      <v-chip v-else color="secondary" dark>{{ currentBook.Location }}</v-chip>
      <v-menu :visible="!isEditMode">
        <template #activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon color="#333">more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" @click="item.action">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text class="pt-2">
      <v-row>
        <v-col cols="12" sm="2">
          <v-img :src="currentBook.Cover" />
        </v-col>
        <v-col cols="12" sm="6" class="px-2">
          <v-row>
            <v-text-field
              v-if="isEditMode"
              v-model="currentBook.Title"
              :readonly="!isEditMode"
              label="title"
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="currentBook.PublishDate"
              :readonly="!isEditMode"
              label="publishDate"
            />
          </v-row>
          <v-row>
            <v-combobox
              v-model="currentBook.Authors"
              :readonly="!isEditMode"
              label="authors"
              chip
              solo
              multiple
            >
              <template #selection="data">
                <v-chip
                  :input-value="data.selected"
                  :close="isEditMode"
                  @input="remove(data.item)"
                >
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>
          </v-row>
          <v-row>
            登録: {{ currentBook.Created | displayDate }} ({{
              convertUserName(currentBook.CreatedUserId)
            }})
          </v-row>
          <v-row>
            更新: {{ currentBook.Modified | displayDate }} ({{
              convertUserName(currentBook.ModifiedUserId)
            }})
          </v-row>
        </v-col>
        <v-col cols="12" sm="4" class="px-2">
          <span v-if="currentBook.OnLoan">
            <v-btn
              v-if="isBorrowUser"
              outlined
              color="primary"
              block
              rounded
              :loading="progress"
              @click="Return"
              >返却する</v-btn
            >
            <v-btn v-else block disabled>貸出中です</v-btn>
          </span>
          <v-btn
            v-else
            color="primary"
            block
            rounded
            :loading="progress"
            @click="Rent"
            >借りる</v-btn
          >
          <div>最終貸出日: {{ readableTime }}</div>
          <div>ISBN: {{ currentBook.ISBN }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          :readonly="!isEditMode"
          label="Description"
          :value="currentBook.Comment"
        />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="Close">{{ closeButtonLabel }}</v-btn>
      <v-btn v-if="isEditMode" color="primary" @click="Save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { IUser } from "@common/IUser";
import { getUser } from "@/model/Users";
import { IBook } from "@common/IBook";
import { saveBook, rentBook, returnBook } from "@/model/Book";
import { BooksMapper } from "@/modules/BooksModule";

const Super = Vue.extend({
  methods: BooksMapper.mapActions(["updateBook"]),
});

@Component
export default class BookDetail extends Super {
  @Prop({ type: Object, required: true }) currentUser!: IUser;
  @Prop({ type: Object, required: true }) currentBook!: IBook;
  @Prop({ type: String, default: "Close" }) closeButtonLabel!: string;
  isEditMode = false;
  progress = false;
  items: Array<{ title: string; action: () => void }> = [
    {
      title: "Edit",
      action: () => {
        this.change();
      },
    },
  ];

  change(): void {
    this.isEditMode = true;
  }

  Close(): void {
    this.isEditMode = false;
    this.$emit("close-dialog");
  }

  get readableTime(): string {
    if (!this.currentBook.LastBorrowTimestamp) {
      return "なし";
    }
    const d = new Date(this.currentBook.LastBorrowTimestamp.seconds * 1000);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }

  get isBorrowUser(): boolean {
    return this.currentBook.LastBorrowUserId === this.currentUser.Id;
  }

  async Commit(): Promise<any> {
    if (!this.currentUser) {
      return;
    }

    this.currentBook.Modified = new Date();
    this.currentBook.ModifiedUserId = this.currentUser.Id;
    await saveBook(this.currentBook);
  }

  async Rent(): Promise<void> {
    this.progress = true;
    try {
      await rentBook(this.currentBook.ISBN, this.currentUser.Id);
      await this.updateBook(this.currentBook.ISBN);
    } catch (error) {
      console.log(error);
    } finally {
      this.progress = false;
    }
  }

  async Return(): Promise<void> {
    this.progress = true;
    try {
      await returnBook(this.currentBook.ISBN);
      await this.updateBook(this.currentBook.ISBN);
    } catch (error) {
      console.log(error);
    } finally {
      this.progress = false;
    }
  }

  async Save() {
    await this.Commit();
    this.Close();
  }

  remove(item: string) {
    this.currentBook.Authors = this.currentBook.Authors.filter(
      (author) => author !== item
    );
  }

  convertUserName(userId: string) {
    const user = getUser(userId);
    return user && user.displayName ? user.displayName : "不明な人物";
  }
}
</script>

<style>
.theme--light.v-messages {
  min-height: 0;
}
</style>
