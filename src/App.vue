<template>
  <v-app>
    <v-toolbar app>

      <v-flex align-center layout py-2>
        <v-toolbar-title class='headline text-uppercase'>
            <span>Books</span>
            <span class='font-weight-light'>Manager</span>
        </v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-btn icon large to='/'>
          <v-icon>list</v-icon>
        </v-btn>
        <v-btn icon large to='/register'>
          <v-icon>add</v-icon>
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator='{ on }'>
            <v-avatar @click='signOut' dark v-on='on' 
                      slot='offset' class='mx-auto d-block' size='40'>
              <img :src='ImageUrl'>
            </v-avatar>
          </template>
          <span> {{ UserName }} </span>
        </v-tooltip>
      </v-flex>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center fluid column>
          <v-fade-transition mode='out-in'>
            <router-view></router-view>
          </v-fade-transition>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  get IsSignin(): boolean {
    return this.$store.getters.IsSignin;
  }

  get UserName(): string | null {
    return this.$store.getters.User.Name;
  }

  get ImageUrl(): string | null {
    return this.$store.getters.User.ImageUrl;
  }

  private signOut(): void {
    this.$store.dispatch('Signout');
    this.$router.push('/signin');
  }
}
</script>
