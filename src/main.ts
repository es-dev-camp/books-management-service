import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import '@/plugins/vuetify';
import App from '@/App.vue';
import { createStore } from '@/store';
import { createRouter } from '@/router';
import moment from 'moment';

Vue.config.productionTip = false;

Vue.filter('displayDate', (value: any) => {
  try {
    const dateFormat = 'YYYY/MM/DD';
    const now = moment();
    const date = moment.unix(value.seconds);
    if (date.format(dateFormat) === now.format(dateFormat)) {
      return date.format('HH:mm');
    }

    if (date.add(1, 'days').format(dateFormat) === now.format(dateFormat)) {
      return `昨日 ${date.format('HH:mm')}`;
    }
    return date.format(dateFormat);
  } catch {
    return 'Unknown';
  }
});

Vue.use(Vuex);
Vue.use(Router);

const store = createStore();
const router = createRouter(store);

new Vue({
  render: h => h(App),
  router: router,
  store: store,
  components: { App },
  template: '<App/>'
}).$mount('#app');
