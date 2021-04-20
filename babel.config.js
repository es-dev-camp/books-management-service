const plugins = ['require-context-hook'];
module.exports = api => ({
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],
  ...(api.env('test') && { plugins })
});
