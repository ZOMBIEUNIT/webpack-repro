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
  devServer: {
    contentBase: './dist'
  },
  mode: 'development',
  watch: true,
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: {
      cacheGroups: {
        localLibs: {
          test: module => module === 'lib',
          idHint: 'localLibs',
          chunks: 'initial',
          enforce: true,
          priority: 1
        }
      }
    }
  }
};