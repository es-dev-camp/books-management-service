<template>
  <v-app>
    <v-container>
      <v-layout text-center wrap>
        <v-flex mb-4>
          <v-btn color="primary" @click="onSignIn">Google sign in</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
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
