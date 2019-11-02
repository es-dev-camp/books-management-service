import { configure, addDecorator } from '@storybook/vue';
import vuetify from '../src/plugins/vuetify';

const vuetifyDecorator = () => ({
  template: '<story/>',
  vuetify: vuetify
});

addDecorator(vuetifyDecorator);
const req = require.context('../src/', true, /.*\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
