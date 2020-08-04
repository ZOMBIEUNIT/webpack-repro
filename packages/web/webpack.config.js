const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    symlinks: false
  },
  mode: 'development',
  watch: true
};