import { configure, addDecorator, addParameters } from '@storybook/vue';
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { themes } from '@storybook/theming';
import { VApp } from 'vuetify/lib';

import vuetify from '../src/plugins/vuetify';

// @ts-ignore
setConsoleOptions({
  panelExclude: []
});

const vuetifyDecorator = () => ({
  components: { VApp },
  template: '<v-app><story/></v-app>',
  vuetify: vuetify
});

addDecorator(vuetifyDecorator);

addParameters({
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
  backgrounds: [
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ],
  options: {
    theme: themes.light,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  }
});

const req = require.context('../src/', true, /.*\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
