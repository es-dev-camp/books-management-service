const vueConfig = require('@vue/cli-service/webpack.config.js');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-postcss',
    '@storybook/addon-viewport'
  ],
  webpackFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...vueConfig.resolve,
        alias: {
          ...vueConfig.resolve.alias,
          vue$: 'vue/dist/vue.esm.js'
        }
      },
      module: {
        ...vueConfig.module,
        rules: [
          ...vueConfig.module.rules,
          {
            // For TypeScript
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  appendTsSuffixTo: [/\.vue$/],
                  transpileOnly: true
                },
              }
            ]
          }
        ]
      }
    }
  }
}
