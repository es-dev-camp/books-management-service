import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import VueAnalytics from 'vue-analytics';
import vuetify from '@/plugins/vuetify';
import App from '@/App.vue';
import { createStore } from '@/store';
import { createRouter } from '@/router';
import { displayDate, localDate } from '@/utilities/filters';

Vue.config.productionTip = false;

Vue.filter('displayDate', displayDate);
Vue.filter('localDate', localDate);

Vue.use(Vuex);
Vue.use(Router);

const store = createStore();
const router = createRouter(store);

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_ANALYTICS_ID,
  router,
  property: '$ga'
});

new Vue({
  components: { App },
  render: h => h(App),
  router: router,
  store: store,
  template: '<App/>',
  vuetify
}).$mount('#app');
