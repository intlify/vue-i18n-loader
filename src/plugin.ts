import webpack from 'webpack'

declare class IntlifyVuePlugin implements webpack.Plugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(optoins: Record<string, any>)
  apply(compiler: webpack.Compiler): void
}

let Plugin: typeof IntlifyVuePlugin

console.warn(
  `[@intlify/vue-i18n-loader] IntlifyVuePlugin is experimental! This plugin is used for Intlify tools. Don't use this plugin to enhancement Component options.`
)

if (webpack.version && webpack.version[0] > '4') {
  // webpack5 and upper
  Plugin = require('./pluginWebpack5').default // eslint-disable-line @typescript-eslint/no-var-requires
} else {
  // webpack4 and lower
  Plugin = require('./pluginWebpack4').default // eslint-disable-line @typescript-eslint/no-var-requires
}

export default Plugin
