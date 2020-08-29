import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper,
} from 'vuex-smart-module';
import firebase from '@/firebase/firestore';
import { Auth0Client, auth0Client } from '@/auth0/client';

const isDevelopMode = process.env.NODE_ENV === 'develop';

class SignInState {
  user: Auth0Client = auth0Client;
}

class SignInGetters extends Getters<SignInState> {
  get getUser() {
    return this.state.user.profile;
  }

  get isSignIn() {
    return this.state.user.isSignIn;
  }
}

class SignInMutations extends Mutations<SignInState> {
  async setFirebaseCustomToken(user: firebase.User | null) {
    console.log(user);
    const response = await fetch(
      isDevelopMode
        ? `http://localhost:5000/${process.env.VUE_APP_PROJECT_ID}/us-central1/auth`
        : `https://us-central1-${process.env.VUE_APP_PROJECT_ID}.cloudfunctions.net/auth`,
      {
        headers: {
          Authorization: `Bearer ${this.state.user.idToken}`,
        },
      }
    );

    // 受け取ったトークンを使ってサインインする
    const data = await response.json();
    await firebase.auth().signInWithCustomToken(data.firebaseToken);

    // Firebase の認証結果を確認して情報更新
    const currentUser = firebase.auth().currentUser;
    console.log('currentUser', currentUser);
    if (!currentUser) {
      return;
    }

    const profile = this.state.user.profile;
    await currentUser.updateProfile({
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });
    if (profile.Email) {
      await currentUser.updateEmail(profile.Email);
    }

    await firebase
      .firestore()
      .collection('user')
      .doc(profile.Id)
      .set(profile, { merge: true });
  }
  async updateCurrentUser(user: firebase.User | null) {
    const loggedInThroughCallback = await auth0Client.handleCallback();
    if (loggedInThroughCallback) {
      await this.setFirebaseCustomToken(user);
    }
  }
  signIn(redirectUri: string) {
    this.state.user.signIn(redirectUri);
  }
  signOut() {
    this.state.user.signOut();
  }
}

class SignInActions extends Actions<
  SignInState,
  SignInGetters,
  SignInMutations,
  SignInActions
> {
  updateCurrentUser(user: firebase.User | null) {
    this.commit('updateCurrentUser', user);
    console.log('updateCurrentUser');
  }
  signIn(redirectUri: string) {
    this.commit('signIn', redirectUri);
    console.log('signIn');
  }
  signOut() {
    this.commit('signOut', null);
    console.log('signOut');
  }
}

export const SignInModule = new Module({
  state: SignInState,
  getters: SignInGetters,
  mutations: SignInMutations,
  actions: SignInActions,
});

export const SignInMapper = createMapper(SignInModule);
