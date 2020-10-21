<template>
  <v-app>
    <v-overlay :value="isSignOut" />
    <v-app-bar app hide-on-scroll>
      <v-toolbar-title class="headline text-uppercase">
        <span>Books</span>
        <span class="font-weight-light">Manager</span>
      </v-toolbar-title>

      <v-text-field
        v-model="filter"
        text
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="mx-5 hidden-sm-and-down"
      ></v-text-field>

      <v-spacer></v-spacer>
      <v-btn class="mx-2" icon large to="/book-event-list">
        <v-icon>announcement</v-icon>
      </v-btn>
      <v-btn class="mx-2" icon large to="/">
        <v-icon>view_comfy</v-icon>
      </v-btn>
      <v-btn class="mx-2" icon large to="/register">
        <v-icon>add</v-icon>
      </v-btn>
      <v-menu :close-on-content-click="false" offset-y>
        <template #activator="{ on: menu }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-avatar
                slot="offset"
                dark
                class="mx-auto d-block"
                size="40"
                v-on="{ ...tooltip, ...menu }"
              >
                <img :src="userImageUrl" />
              </v-avatar>
            </template>
            <span>{{ userDisplayName }}</span
            ><br />
            <span class="caption font-weight-light">{{ userEmail }}</span>
          </v-tooltip>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar size="60">
                <img :src="userImageUrl" :alt="userDisplayName" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ userDisplayName }}</v-list-item-title>
                <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <v-row align="center" justify="center" class="ma-2">
            <v-btn outlined @click="onSignOut"> Logout </v-btn>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions class="pb-2">
            <v-spacer></v-spacer>
            <span class="subtitle-2 font-weight-light">es-dev-camp</span>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SignInMapper } from "@/modules/SignInModule";
import { BooksMapper } from "@/modules/BooksModule";

const Super = Vue.extend({
  computed: {
    ...BooksMapper.mapGetters(["getFilter"]),
    ...SignInMapper.mapGetters(["getUser"]),
  },
  methods: {
    ...BooksMapper.mapActions(["setFilter"]),
    ...SignInMapper.mapActions(["signOut"]),
  },
});

@Component
export default class App extends Super {
  isSignOut = false;

  get userImageUrl(): string {
    return this.getUser?.photoURL || "";
  }

  get userDisplayName(): string {
    return this.getUser?.displayName || "";
  }

  get userEmail(): string {
    return this.getUser?.email || "";
  }

  get filter(): string {
    return this.getFilter;
  }

  set filter(val: string) {
    this.setFilter(val);
  }

  async onSignOut() {
    this.isSignOut = true;
    await this.signOut();
  }
}
</script>
