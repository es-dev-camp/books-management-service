import { configure, addDecorator } from '@storybook/vue';
import '@storybook/addon-console';
import { VApp } from 'vuetify/lib';

import vuetify from '../src/plugins/vuetify';

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

const req = require.context('../src/', true, /.*\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
