import webpack from 'webpack'
import loaderUtils from 'loader-utils'
import { parse } from 'querystring'
import { RawSourceMap } from 'source-map'
import { generateCode, VueI18nLoaderOptions } from './gen'

const loader: webpack.loader.Loader = function (
  source: string | Buffer,
  sourceMap: RawSourceMap | undefined
): void {
  const loaderContext = this // eslint-disable-line @typescript-eslint/no-this-alias
  const options = loaderUtils.getOptions(loaderContext) || {}

  if (this.version && Number(this.version) >= 2) {
    try {
      this.cacheable && this.cacheable()
      const code = `${generateCode(
        source,
        parse(this.resourceQuery),
        options as VueI18nLoaderOptions
      )}`
      this.callback(null, code, sourceMap)
    } catch (err) {
      this.emitError(err.message)
      this.callback(err)
    }
  } else {
    const message = 'support webpack 2 later'
    this.emitError(message)
    this.callback(new Error(message))
  }
}

export default loader
