<template>
  <v-app>
    <v-app-bar app>
      <v-flex align-center layout py-2>
        <v-toolbar-title class="headline text-uppercase">
          <span>Books</span>
          <span class="font-weight-light">Manager</span>
        </v-toolbar-title>

        <v-text-field
          text
          solo-inverted
          hide-details
          prepend-inner-icon="search"
          label="Search"
          class="mx-5 hidden-sm-and-down"
          v-model="filter"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn class="mx-2" icon large to="/">
          <v-icon>list</v-icon>
        </v-btn>
        <v-btn class="mx-2" icon large to="/register">
          <v-icon>add</v-icon>
        </v-btn>
        <v-tooltip class="mx-2" bottom>
          <template v-slot:activator="{ on }">
            <v-avatar
              @click="signOut"
              dark
              v-on="on"
              slot="offset"
              class="mx-auto d-block"
              size="40"
            >
              <img :src="getUser.photoURL" />
            </v-avatar>
          </template>
          <span> {{ getUser.displayName }} </span>
        </v-tooltip>
      </v-flex>
    </v-app-bar>
    <v-content>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SignInModule } from "@/modules/SignInModule";
import { BooksModule } from "@/modules/BooksModule";

const Super = Vue.extend({
  methods: BooksModule.mapActions(["setFilter"]),
  computed: BooksModule.mapGetters(["getFilter"])
});

@Component({
  computed: SignInModule.mapGetters(["getUser", "isSignIn"]),
  methods: SignInModule.mapActions(["signOut"])
})
export default class App extends Super {
  get filter(): string {
    return this.getFilter;
  }

  set filter(val: string) {
    this.setFilter(val);
  }
}
</script>
