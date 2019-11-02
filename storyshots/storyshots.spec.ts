import initStoryshots, {
  multiSnapshotWithOptions
} from '@storybook/addon-storyshots';
import JestSerializerVue from 'jest-serializer-vue';

const JestSerializerIDMocking = {
  print(val: string) {
    const re = /^(input|list|radio)-(\d+)$/g;
    if (
      val.startsWith('input') ||
      val.startsWith('list') ||
      val.startsWith('radio')
    ) {
      return '"' + val.replace(re, '$1-<number>') + '"';
    }
    return '"' + val + '"';
  },

  test(val: any) {
    return typeof val === 'string';
  }
};

initStoryshots({
  configPath: 'storyshots',
  test: multiSnapshotWithOptions({}),
  snapshotSerializers: [JestSerializerIDMocking, JestSerializerVue]
});
