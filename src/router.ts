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

  firebase.auth().onAuthStateChanged(async user => {
    await signInCtx.actions.updateCurrentUser(user);
    console.debug('on auth state changed');
  });

  router.beforeEach((to, from, next) => {
    if (
      to.matched.some(record => !record.meta.noAuth) &&
      !signInCtx.getters.isSignIn
    ) {
      let counter = 0;
      const interval = 100;
      const waitMaxmiliSec = 1500;
      const iid = setInterval(async () => {
        if (counter < waitMaxmiliSec / interval) {
          counter++;
          if (signInCtx.getters.isSignIn) {
            clearInterval(iid);
            next();
          }
        } else {
          console.log('wait exceeded');
          clearInterval(iid);
          if (!signInCtx.getters.isSignIn) {
            console.log('move signIn');
            await signInCtx.actions.signIn(to.fullPath);
          }
        }
      }, interval);
    } else {
      next();
    }
  });
  return router;
}
