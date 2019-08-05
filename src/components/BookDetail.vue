<template>
  <v-card>
    <v-card-title class='headline grey lighten-2' primary-title>
      {{ $attrs.Book.Title }}
      <v-spacer></v-spacer>
      <v-text-field class="px-1" v-if='isEditMode'
        label="location" v-model="$attrs.Book.Location" />
      <v-chip v-else color="secondary" dark>{{ $attrs.Book.Location }}</v-chip>
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
    </v-card-title>

    <v-card-text>
      <v-layout align-start wrap>
        <v-flex xs2>
          <v-img :src='$attrs.Book.Cover' />
        </v-flex>
        <v-flex xs6>
          <v-layout align-center row wrap>
            <v-flex xs12>
              <v-text-field class="px-1" v-if="isEditMode" :readonly='!isEditMode'
                label="title" v-model="$attrs.Book.Title" />
            </v-flex>
            <v-flex xs12>
              <v-text-field class="px-1" :readonly='!isEditMode'
                label="publishDate" v-model="$attrs.Book.PublishDate" />
            </v-flex>
  <v-combobox
    v-model="$attrs.Book.Authors"
    label="authorss"
    chip
    solo
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        :selected="data.selected"
        :close="isEditMode"
        @input="remove(data.item)"
      >
        {{ data.item }}
      </v-chip>
    </template>
  </v-combobox>
            <!-- <v-flex xs12>
              登録: {{ $attrs.Book.Created | displayDate }} ({{ $attrs.Book.CreatedUserName }})
            </v-flex>
            <v-flex xs12>
              更新: {{ $attrs.Book.Modified | displayDate }} ({{ $attrs.Book.ModifiedUserName }})
            </v-flex> -->
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <span v-if='$attrs.Book.OnLoan'>
            <v-btn outline color='primary' block round v-if='this.isBorrowUser' @click='this.Return' :loading='this.progress'>返却する</v-btn>
            <v-btn block disabled v-else>貸出中です</v-btn>
          </span>
          <v-btn v-else color='primary' block round @click='this.Rent' :loading='this.progress'>借りる</v-btn>
          <div>
            最終貸出日: {{this.readableTime}}
          </div>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-textarea :readonly='!isEditMode' label='Description' :value='$attrs.Book.Comment'/>
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
import User from '@/model/User';

@Component
export default class BookDetail extends Vue {
  isEditMode = false;
  progress = false;
  items: Array<{title: string, action: () => void }> = [
    {title: 'Edit', action: () => {
      this.change();
    }},
  ];

  change(): void {
    this.isEditMode = true;
  }

  Close(): void {
    this.isEditMode = false;
    this.$emit('close-dialog');
  }

  get readableTime(): string {
    if (!((this.$attrs.Book as any).LastBorrowTimestamp)) {
      return 'なし';
    }
    const d = new Date((this.$attrs.Book as any).LastBorrowTimestamp.seconds * 1000);
    return `${d.getFullYear()}/${(d.getMonth() + 1)}/${d.getDate()}`;
  }

  get isBorrowUser(): boolean {
    return (this.$attrs.Book as any).LastBorrowUserId === this.$store.getters.User.Id;
  }

  async Commit(): Promise<any> {
    (this.$attrs.Book as any).Modified = new Date();
    (this.$attrs.Book as any).ModifiedUserId = this.$store.getters.User.Id;
    await (this.$attrs.Book as any).Save();
  }

  async Rent(): Promise<void> {
    this.progress = true;
    try {
      await (this.$attrs.Book as any).Rent(this.$store.getters.User.Id);
    } catch (error) {
      console.log(error);
    } finally {
      this.progress = false;
    }
  }

  async Return(): Promise<void> {
    this.progress = true;
    try {
      await (this.$attrs.Book as any).Return();
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
    (this.$attrs.Book as any).Authors = (this.$attrs.Book as any).Authors.filter((a: any) => a !== item);
  }
}
</script>

<style>
.theme--light.v-messages {
    min-height: 0;
}
</style>
