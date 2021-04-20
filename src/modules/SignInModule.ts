import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper
} from 'vuex-smart-module';
import firebase from '@/firebase/firestore';

class SignInState {
  user: firebase.User | null = null;
}

class SignInGetters extends Getters<SignInState> {
  get getUser() {
    return this.state.user;
  }
}

class SignInMutations extends Mutations<SignInState> {
  setUser(user: firebase.User | null) {
    this.state.user = user;
  }
}

class SignInActions extends Actions<
  SignInState,
  SignInGetters,
  SignInMutations,
  SignInActions
> {
  updateUser(user: firebase.User | null) {
    this.commit('setUser', user);
  }
  async signOut() {
    await firebase.auth().signOut();
  }
}

export const SignInModule = new Module({
  state: SignInState,
  getters: SignInGetters,
  mutations: SignInMutations,
  actions: SignInActions
});

export const SignInMapper = createMapper(SignInModule);
