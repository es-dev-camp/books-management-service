import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueLazyload from 'vue-lazyload';

Vue.use(Vuetify);

Vue.use(VueLazyload, {
  preLoad: 1.3
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  }
});
