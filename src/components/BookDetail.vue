<template>
  <v-card>
    <v-card-title class='headline grey lighten-2' primary-title>
      {{ this.Book.Title }}
      <v-spacer></v-spacer>
      <div bottom left>
        <v-chip color="secondary" dark>{{ this.Book.Location }}</v-chip>
        <v-menu :visible='!this.isEditMode'>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              icon
              v-on="on"
            >
              <v-icon color="#333">more_vert</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(item, i) in items"
              :key="i"
              @click='item.action'
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>

    <v-card-text>
      <v-layout align-center row wrap>
        <v-flex xs2>
          <v-img :src='this.Book.Cover' />
        </v-flex>
        <v-flex xs10>
          <v-layout align-center row wrap>
            <v-flex xs12>
              <v-text-field v-if="isEditMode" class="pt-0" :readonly='!isEditMode'
                label="title" v-model="this.Book.Title" />
            </v-flex>
            <v-flex xs12>
              <v-text-field class="pt-0" :readonly='!isEditMode'
                label="publishDate" v-model="this.Book.PublishDate" />
            </v-flex>
            <v-flex xs3 v-for='(author, index) in this.Book.Authors' v-bind:key="index">
              <v-text-field class="pt-0" :value="author" /> &ensp;
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-textarea :readonly='!isEditMode' label='Description' :value='this.Book.Comment'/>
      </v-flex>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click='this.Close'>Close</v-btn>
      <v-btn v-if='this.isEditMode' color='primary' @click='this.Save'>Save</v-btn>
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
  private isEditMode = false;
  private items: Array<{title: string, action: () => void }> = [
    {title: 'Edit', action: () => {
      this.change();
    }},
  ];

  private change() {
    this.isEditMode = true;
  }

  private Close(): void {
    this.isEditMode = false;
    this.$emit('close-dialog');
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
