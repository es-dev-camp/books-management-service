import Vue from 'vue';
import Vuetify from 'vuetify';
import VueLazyload from 'vue-lazyload';
import ja from 'vuetify/lib/locale/ja';
import colors from 'vuetify/lib/util/colors';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

Vue.use(VueLazyload, {
  preLoad: 1.3
});

const lightThemeSettings = {
  // TODO: いい感じなテーマカラーにする
  primary: colors.blue,
  // secondary: colors.green.base,
  accent: colors.pink
  // error: '#FF5252',
  // info: '#2196F3',
  // success: '#4CAF50',
  // warning: '#FB8C00'
};

export default new Vuetify({
  lang: {
    locales: { ja },
    current: 'ja'
  },
  theme: {
    dark: false,
    themes: {
      light: lightThemeSettings
    }
  },
  icons: {
    iconfont: 'mdi'
  }
});
