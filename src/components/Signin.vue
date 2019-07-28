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
import firebase from '@/firebase/firestore';

@Component
export default class Login extends Vue {
  private signIn(): void {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          console.log(result);
          if (result == null || result.user == null) {
            return;
          }

          console.info('Successfull Firebase signin.');
          console.info(`name:${result.user.displayName}\nid:${result.user.uid}\nphotoURL:${result.user.photoURL}`);
          console.info('%c ', `background:url(${result.user.photoURL});
                       background-repeat:no-repeat;padding-left:400px;font-size:0px;line-height:400px`);
          this.$store.dispatch('Signin');

          const redirect = this.$route.query.redirect.toString();
          if (redirect == null) {
            this.$router.push('/');
            return;
          }
          this.$router.push(redirect);
        })
        .catch((error) => {
          console.exception(error);
        });
  }
}
</script>

<style>

</style>
