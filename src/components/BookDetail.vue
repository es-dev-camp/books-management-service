<template>
  <v-card>
    <v-card-title class='headline grey lighten-2' primary-title>
      {{ this.Book.Title }}
    </v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex xs2>
          <v-img :src='this.Book.Cover' />
        </v-flex>
        <v-flex xs10>
          <v-card-title primary-title>
            <div>
              <div>Publish {{ this.Book.PublishDate }}</div>
              <template v-for='author in this.Book.Authors'>
                {{ author }}&ensp;
              </template>
            </div>
          </v-card-title>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-textarea readonly label='Description' :value='this.Book.Comment'/>
      </v-flex>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click='this.Commit'>Apply</v-btn>
      <v-btn color='primary' @click='this.Save'>Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import IBook from '@/model/IBook.ts';
import Book from '@/model/Book.ts';

@Component
export default class BookDetail extends Vue {
  @Prop({default: new Book()})
  public Book!: IBook;

  private Close(): void {
    this.Book.ShowDetail = false;
  }

  private async Commit(): Promise<any> {
    this.Book.Modified = new Date();
    this.Book.ModifiedUserId = this.$store.getters.User.Id;
    await this.Book.Save();
  }

  private async Save(): Promise<any> {
    await this.Commit();
    this.Close();
  }
}
</script>

<style scoped>
</style>
