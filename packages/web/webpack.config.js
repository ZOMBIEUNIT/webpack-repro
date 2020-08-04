import path from 'path'

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  mode: 'development',
  watch: true
};