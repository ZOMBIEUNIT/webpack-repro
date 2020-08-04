const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'lib',
    libraryTarget: 'umd'
  },
  mode: 'development'
};