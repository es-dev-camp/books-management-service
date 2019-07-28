import Vue from 'vue';
import VueRouter from 'vue-router';
import Signin from '@/components/Signin.vue';
import Books from '@/components/BooksList.vue';
import Register from '@/components/Register.vue';
import Capture from '@/components/Capture.vue';
import firebase from '@/firebase/firestore';
import store from '@/store/store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Books',
      component: Books,
      meta: { requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      store.dispatch('UpdateSigininStatus');
      if (user) {
        next();
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath },
        });
      }
    });
  } else {
    next();
  }
});

export default router;

