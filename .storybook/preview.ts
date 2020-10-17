import { addDecorator } from '@storybook/vue';
import '@storybook/addon-console';
import { VApp } from 'vuetify/lib';

import vuetify from '../src/plugins/vuetify';

import { addParameters } from '@storybook/vue';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS
  }
});

const backgroundColorDecorator = () => ({
  template:
    '<div style="background-color: rgb(134, 212, 226); padding: 20px; width: 100%; height: 100%;"><story/></div>'
});

const vuetifyDecorator = () => ({
  components: { VApp },
  template: '<v-app><story/></v-app>',
  vuetify: vuetify
});

addDecorator(backgroundColorDecorator);
addDecorator(vuetifyDecorator);
