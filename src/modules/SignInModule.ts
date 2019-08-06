import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import firebase from 'firebase/app';

class SignInState {
  user: firebase.User | null = null;
  isSignIn: boolean = false;
}

class SignInGetters extends Getters<SignInState> {
  get getUser() {
    return this.state.user
      ? this.state.user
      : { displayName: '', photoURL: '' };
  }

  get isSignIn() {
    return this.state.isSignIn;
  }
}

class SignInMutations extends Mutations<SignInState> {
  setUser(user: firebase.User | null) {
    this.state.user = user;
  }
  setIsSignIn(flag: boolean) {
    this.state.isSignIn = flag;
  }
}

class SignInActions extends Actions<
  SignInState,
  SignInGetters,
  SignInMutations,
  SignInActions
> {
  async updateCurrentUser() {
    const user = await firebase.auth().currentUser;
    const isSignIn = user ? true : false;
    this.commit('setUser', user);
    this.commit('setIsSignIn', isSignIn);
  }
  async signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    await firebase
      .auth()
      .signInWithPopup(provider)
      .catch(err => {
        console.log('error: ', err);
      });
    console.log('signIn');
  }

  async signOut() {
    await firebase
      .auth()
      .signOut()
      .catch(err => {
        console.log('error: ', err);
      });
    console.log('signOut');
  }
}

export const SignInModule = new Module({
  state: SignInState,
  getters: SignInGetters,
  mutations: SignInMutations,
  actions: SignInActions
});
