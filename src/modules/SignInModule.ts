import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import firebase from 'firebase/app';
import IUser from '@/model/IUser';

const nullUser: IUser = {
  Id: '',
  Email: '',
  displayName: 'Anonymous',
  photoURL: null
};
class SignInState {
  user: IUser = nullUser;
  isSignIn: boolean = false;
}

class SignInGetters extends Getters<SignInState> {
  get getUser() {
    return this.state.user
      ? this.state.user
      : nullUser;
  }

  get isSignIn() {
    return this.state.isSignIn;
  }
}

class SignInMutations extends Mutations<SignInState> {
  setUser(user: IUser) {
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
    const firebaseUser = await firebase.auth().currentUser;
    if (firebaseUser) {
      const currentUser: IUser = {
        Id: firebaseUser.uid,
        Email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      };
      this.commit('setUser', currentUser);
      this.commit('setIsSignIn', true);
    } else {
      const currentUser: IUser = nullUser;
      this.commit('setUser', currentUser);
      this.commit('setIsSignIn', false);
    }
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
