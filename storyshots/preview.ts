import { addDecorator } from '@storybook/vue';
import vuetify from '../src/plugins/vuetify';

const vuetifyDecorator = () => ({
  template: '<story/>',
  vuetify: vuetify,
});

addDecorator(vuetifyDecorator);
