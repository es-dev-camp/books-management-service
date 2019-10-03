<template>
  <v-container>
    <v-col cols="12">
      <v-row align="center" justify="center">
        <v-btn color="primary" @click="onSignIn">sign in</v-btn>
      </v-row>
      <v-row align="center" justify="center">
        <span>BOOKS MANAGER を利用する</span>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SignInModule } from "@/modules/SignInModule";

const Super = Vue.extend({
  methods: SignInModule.mapActions(["signIn"])
});

@Component
export default class Login extends Super {
  async onSignIn() {
    await this.signIn();
  }
}
</script>

<style></style>
