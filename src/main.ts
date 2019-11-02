import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import vuetify from '@/plugins/vuetify';
import App from '@/App.vue';
import { createStore } from '@/store';
import { createRouter } from '@/router';
import { displayDate } from '@/utilities/filters';

Vue.config.productionTip = false;

Vue.filter('displayDate', displayDate);

Vue.use(Vuex);
Vue.use(Router);

const store = createStore();
const router = createRouter(store);

new Vue({
  render: h => h(App),
  router: router,
  store: store,
  components: { App },
  template: '<App/>',
  vuetify: vuetify
}).$mount('#app');
