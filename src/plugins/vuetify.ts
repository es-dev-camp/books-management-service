import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import VueLazyload from 'vue-lazyload';

Vue.use(Vuetify, {
  iconfont: 'md',
});

Vue.use(VueLazyload, {
  preLoad: 1.3,
});
