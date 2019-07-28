import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import IAuth from '@/model/IAuth';
import FirebaseAuth from '@/model/FirebaseAuth';
import User from '@/model/User';

Vue.use(Vuex);

const auth: IAuth = new FirebaseAuth();

const store = new Vuex.Store({
  state: {
    user: new User(),
  },
  getters: {
    IsSignin(state): boolean { return state.user.IsSignin; },
    User(state): User | null {
      return state.user;
    },
  },
  actions: {
    Signin({ commit }) {
      auth.Siginin();
      commit('SetSigininStatus');
    },
    Signout({ commit }) {
      auth.Siginout();
      commit('SetSigininStatus');
    },
    UpdateSigininStatus({ commit }) {
      auth.Update();
      commit('SetSigininStatus');
    },
  },
  mutations: {
    SetSigininStatus(state) {
      state.user = auth.User;
    },
  },
});

export default store;
