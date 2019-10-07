<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      {{ getCurrentBook.Title }}
      <v-spacer></v-spacer>
      <v-text-field
        class="px-1"
        v-if="isEditMode"
        label="location"
        v-model="getCurrentBook.Location"
      />
      <v-chip v-else color="secondary" dark>{{
        getCurrentBook.Location
      }}</v-chip>
      <v-menu :visible="!this.isEditMode">
        <template v-slot:activator="{ on }">
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
          <v-img :src="getCurrentBook.Cover" />
        </v-col>
        <v-col cols="12" sm="6" class="px-2">
          <v-row>
            <v-text-field
              v-if="isEditMode"
              :readonly="!isEditMode"
              label="title"
              v-model="getCurrentBook.Title"
            />
          </v-row>
          <v-row>
            <v-text-field
              :readonly="!isEditMode"
              label="publishDate"
              v-model="getCurrentBook.PublishDate"
            />
          </v-row>
          <v-row>
            <v-combobox
              v-model="getCurrentBook.Authors"
              :readonly="!isEditMode"
              label="authors"
              chip
              solo
              multiple
            >
              <template v-slot:selection="data">
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
          <!-- <v-row>
              登録: {{ getCurrentBook.Created | displayDate }} ({{ getCurrentBook.CreatedUserName }})
          </v-row> -->
          <!-- <v-row>
              更新: {{ getCurrentBook.Modified | displayDate }} ({{ getCurrentBook.ModifiedUserName }})
          </v-row> -->
        </v-col>
        <v-col cols="12" sm="4" class="px-2">
          <span v-if="getCurrentBook.OnLoan">
            <v-btn
              outlined
              color="primary"
              block
              rounded
              v-if="this.isBorrowUser"
              @click="this.Return"
              :loading="this.progress"
              >返却する</v-btn
            >
            <v-btn block disabled v-else>貸出中です</v-btn>
          </span>
          <v-btn
            v-else
            color="primary"
            block
            rounded
            @click="this.Rent"
            :loading="this.progress"
            >借りる</v-btn
          >
          <div>最終貸出日: {{ this.readableTime }}</div>
          <div>ISBN: {{ getCurrentBook.ISBN }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          :readonly="!isEditMode"
          label="Description"
          :value="getCurrentBook.Comment"
        />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="this.Close">Close</v-btn>
      <v-btn v-if="this.isEditMode" color="primary" @click="this.Save"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IUser } from "@/model/IUser";
import IBook from "@/model/IBook.ts";
import Book from "@/model/Book.ts";
import { BooksModule } from "@/modules/BooksModule";

const Super = Vue.extend({
  computed: BooksModule.mapGetters(["getCurrentBook"]),
  methods: BooksModule.mapActions(["updateBook"])
});

@Component({
  components: { BookDetail }
})
export default class BookDetail extends Super {
  @Prop({ type: Object, default: null })
  CurrentUser!: IUser;
  isEditMode = false;
  progress = false;
  items: Array<{ title: string; action: () => void }> = [
    {
      title: "Edit",
      action: () => {
        this.change();
      }
    }
  ];

  change(): void {
    this.isEditMode = true;
  }

  Close(): void {
    this.isEditMode = false;
    this.$emit("close-dialog");
  }

  get readableTime(): string {
    if (!this.getCurrentBook.LastBorrowTimestamp) {
      return "なし";
    }
    const d = new Date(this.getCurrentBook.LastBorrowTimestamp.seconds * 1000);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }

  get isBorrowUser(): boolean {
    return this.getCurrentBook.LastBorrowUserId === this.CurrentUser.Id;
  }

  async Commit(): Promise<any> {
    this.getCurrentBook.Modified = new Date();
    this.getCurrentBook.ModifiedUserId = this.CurrentUser.Id;
    await this.getCurrentBook.Save();
  }

  async Rent(): Promise<void> {
    this.progress = true;
    try {
      await this.getCurrentBook.Rent(this.CurrentUser.Id);
      await this.updateBook(this.getCurrentBook.ISBN);
    } catch (error) {
      console.log(error);
    } finally {
      this.progress = false;
    }
  }

  async Return(): Promise<void> {
    this.progress = true;
    try {
      await this.getCurrentBook.Return();
      await this.updateBook(this.getCurrentBook.ISBN);
    } catch (error) {
      console.log(error);
    } finally {
      this.progress = false;
    }
  }

  async Save(): Promise<any> {
    await this.Commit();
    this.Close();
  }

  remove(item: string) {
    this.getCurrentBook.Authors = this.getCurrentBook.Authors.filter(
      author => author !== item
    );
  }
}
</script>

<style>
.theme--light.v-messages {
  min-height: 0;
}
</style>
