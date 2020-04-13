const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: {
    composable: path.resolve(__dirname, './composable/main.js'),
    legacy: path.resolve(__dirname, './legacy/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      vue: '@vue/runtime-dom'
    }
  },
  devServer: {
    stats: 'minimal',
    contentBase: __dirname
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        use: [path.resolve(__dirname, '../lib/index.js')]
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
