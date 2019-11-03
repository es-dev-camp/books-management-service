import { configure, addDecorator, addParameters } from '@storybook/vue';
import '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import { setConsoleOptions } from '@storybook/addon-console';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { themes } from '@storybook/theming';
import { VApp } from 'vuetify/lib';

import vuetify from '../src/plugins/vuetify';

// @ts-ignore
setConsoleOptions({
  panelExclude: []
});

addDecorator(withA11y);

const vuetifyDecorator = () => ({
  components: { VApp },
  template: '<v-app><story/></v-app>',
  vuetify: vuetify
});

addDecorator(vuetifyDecorator);

addParameters({
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
