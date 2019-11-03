const plugins = ['require-context-hook'];
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console');
}

module.exports = api => ({
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],
  ...(api.env('test') && { plugins })
});
