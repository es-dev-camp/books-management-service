import Vue from 'vue';
import Vuetify, { VBtn, VSnackbar } from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';
import ja from 'vuetify/lib/locale/ja';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify, {
  components: {
    VBtn,
    VSnackbar
  },
  directives: {
    Ripple
  }
});

const lightThemeSettings = {
  // TODO: いい感じなテーマカラーにする
  primary: colors.blue.base,
  // secondary: colors.green.base,
  accent: colors.pink.base
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
