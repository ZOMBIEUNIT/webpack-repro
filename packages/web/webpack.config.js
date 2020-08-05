const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    contentBase: './dist'
  },
  mode: 'development',
  watch: true
};