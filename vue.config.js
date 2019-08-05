const buildTarget = process.env.VUE_APP_BUILDTARGET;
const devTool = process.env.VUE_APP_DEVTOOL;

const entrypoint = 'src/main.ts';
const outputDir = 'dist';

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    devtool: !devTool ? false : devTool
  },
  pages: {
    index: entrypoint
  },
  outputDir: outputDir
};
