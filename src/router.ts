import firebase from 'firebase/app';
import { Store } from 'vuex';
import Router from 'vue-router';
import { RouteConfig } from 'vue-router';

import SignIn from '@/views/SignIn.vue';
import Books from '@/views/BooksList.vue';
import Register from '@/views/Register.vue';
import BookEventList from '@/views/BookEventList.vue';
import { SignInModule } from '@/modules/SignInModule';

export const AppRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Books',
    component: Books
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/book-event-list',
    name: 'BookEventList',
    component: BookEventList
  }
];

export const SignInRoute: RouteConfig = {
  path: '/signin',
  name: 'SignIn',
  component: SignIn,
  meta: {
    noAuth: true
  }
};

export const Routes: RouteConfig[] = [...AppRoutes, SignInRoute];

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
    if (user) {
      // NOTE: 認証済みの場合はsign_inを表示できないようにする
      if (location.href.indexOf(SignInRoute.path) > -1) {
        console.log('push', AppRoutes[0].path);
        router.push(AppRoutes[0].path);
      }
    }
  });

  router.beforeEach((to, from, next) => {
    if (
      to.matched.some(record => !record.meta.noAuth) &&
      !signInCtx.getters.isSignIn
    ) {
      let counter = 0;
      const interval = 100;
      const waitMaxmiliSec = 3000;
      const iid = setInterval(() => {
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
            next({
              path: '/signin',
              query: { redirect: to.fullPath }
            });
          }
        }
      }, interval);
    } else {
      next();
    }
  });
  return router;
}
