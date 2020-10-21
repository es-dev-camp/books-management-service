import Vue from 'vue';
import Vuetify, {
  VAppBar,
  VAvatar,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VCombobox,
  VContainer,
  VDialog,
  VDivider,
  VFadeTransition,
  VIcon,
  VImg,
  VList,
  VListItem,
  VListItemAvatar,
  VListItemContent,
  VListItemSubtitle,
  VListItemTitle,
  VMenu,
  VOverlay,
  VProgressLinear,
  VRow,
  VSnackbar,
  VSpacer,
  VTextarea,
  VTextField,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/lib';
import ja from 'vuetify/src/locale/ja';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify, {
  components: {
    VAppBar,
    VAvatar,
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VChip,
    VCol,
    VCombobox,
    VContainer,
    VDialog,
    VDivider,
    VFadeTransition,
    VIcon,
    VImg,
    VList,
    VListItem,
    VListItemAvatar,
    VListItemContent,
    VListItemSubtitle,
    VListItemTitle,
    VMenu,
    VOverlay,
    VProgressLinear,
    VRow,
    VSnackbar,
    VSpacer,
    VTextarea,
    VTextField,
    VToolbarTitle,
    VTooltip,
  },
});

const lightThemeSettings = {
  // TODO: いい感じなテーマカラーにする
  primary: colors.blue.base,
  // secondary: colors.green.base,
  accent: colors.pink.base,
  // error: '#FF5252',
  // info: '#2196F3',
  // success: '#4CAF50',
  // warning: '#FB8C00'
};

export default new Vuetify({
  lang: {
    locales: { ja },
    current: 'ja',
  },
  theme: {
    dark: false,
    themes: {
      light: lightThemeSettings,
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
