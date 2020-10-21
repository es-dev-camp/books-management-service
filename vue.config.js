const devTool = process.env.VUE_APP_DEVTOOL;
const path = require('path');

const entrypoint = 'src/main.ts';
const outputDir = 'dist';

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    devtool: !devTool ? false : devTool,
    resolve: {
      alias: {
        '@common': path.resolve(__dirname, 'common'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 2400000,
      },
    },
  },
  pages: {
    index: entrypoint,
  },
  outputDir: outputDir,
  pluginOptions: {
    storybook: {
      allowedPlugins: ['define'],
    },
  },
  transpileDependencies: ['vuetify'],
};
