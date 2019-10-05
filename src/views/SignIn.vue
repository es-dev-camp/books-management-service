<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SignInModule } from "@/modules/SignInModule";

const Super = Vue.extend({
  methods: SignInModule.mapActions(["signIn"])
});

@Component
export default class Login extends Super {
  async created() {
    await this.signIn();
  }
}
</script>

<style></style>
