import webpack from 'webpack'

export default class IntlifyVuePlugin implements webpack.Plugin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apply(compiler: webpack.Compiler): void {
    console.error('[@intlify/vue-i18n-loader] Cannot support webpack5 yet')
  }
}
