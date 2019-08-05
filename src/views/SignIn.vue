<template>
  <v-app>
    <v-container>
          <v-layout text-xs-center wrap>
            <v-flex mb-4>
              <v-btn color='primary' @click='signIn'>Google sign in</v-btn>
            </v-flex>
          </v-layout>
    </v-container>
  </v-app>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { SignInModule } from '@/modules/SignInModule';

@Component({
  methods: SignInModule.mapActions(["signIn"])
})
export default class Login extends Vue {}
</script>

<style>

</style>
