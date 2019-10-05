import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import firebase from 'firebase/app';
import { Auth0Client, auth0Client } from '@/auth0/client';

const isDevelopMode = process.env.VUE_APP_BUILD_MODE === 'develop';

class SignInState {
  user: Auth0Client = auth0Client;
  isSignIn: boolean = false;
}

class SignInGetters extends Getters<SignInState> {
  get getUser() {
    return this.state.user.profile;
  }

  get isSignIn() {
    return this.state.isSignIn;
  }
}

class SignInMutations extends Mutations<SignInState> {
  async setFirebaseCustomToken(user: firebase.User | null) {
    const response = await fetch(
      isDevelopMode
        ? `http://localhost:5000/${process.env.VUE_APP_PROJECT_ID}/us-central1/auth`
        : `https://us-central1-${process.env.VUE_APP_PROJECT_ID}.cloudfunctions.net/auth`,
      {
        headers: {
          Authorization: `Bearer ${this.state.user.idToken}`
        }
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
      photoURL: profile.photoURL
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
      this.state.isSignIn = true;
      await this.setFirebaseCustomToken(user);
    }
  }
  async signIn(_: null) {
    this.state.user.signIn();
  }
  async signOut(_: null) {
    this.state.user.signOut();
    this.state.isSignIn = false;
  }
}

class SignInActions extends Actions<
  SignInState,
  SignInGetters,
  SignInMutations,
  SignInActions
> {
  async updateCurrentUser(user: firebase.User | null) {
    this.commit('updateCurrentUser', user);
    console.log('updateCurrentUser');
  }
  async signIn() {
    this.commit('signIn', null);
    console.log('signIn');
  }
  async signOut() {
    this.commit('signOut', null);
    console.log('signOut');
  }
}

export const SignInModule = new Module({
  state: SignInState,
  getters: SignInGetters,
  mutations: SignInMutations,
  actions: SignInActions
});
