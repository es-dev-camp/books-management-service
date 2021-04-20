import firebase from '@/firebase/firestore';
import { Store } from 'vuex';
import Router from 'vue-router';
import { RouteConfig } from 'vue-router';
import { SignInModule } from '@/modules/SignInModule';

export const AppRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Books',
    component: () =>
      import(/* webpackChunkName: "books"*/ '@/views/BooksList.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "register"*/ '@/views/Register.vue')
  },
  {
    path: '/book-event-list',
    name: 'BookEventList',
    component: () =>
      import(
        /* webpackChunkName: "book-event-list"*/ '@/views/BookEventList.vue'
      )
  }
];

export const Routes: RouteConfig[] = [...AppRoutes];

export function createRouter(store: Store<any>) {
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: Routes
  });

  const signInCtx = SignInModule.context(store);

  firebase.auth().onAuthStateChanged(user => {
    signInCtx.actions.updateUser(user);
  });

  router.beforeEach(async (to, from, next) => {
    if (!firebase.auth().currentUser) {
      await firebase.auth().getRedirectResult();
      if (firebase.auth().currentUser) {
        next();
        return;
      }
      const provider = new firebase.auth.OAuthProvider('oidc.auth0');
      firebase.auth().signInWithRedirect(provider);
    } else {
      next();
    }
  });
  return router;
}
