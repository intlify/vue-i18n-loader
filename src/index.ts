import path from 'path'
import webpack from 'webpack'
import loaderUtils from 'loader-utils'
import { parse } from 'querystring'
import { RawSourceMap } from 'source-map'
import { isEmptyObject } from '@intlify/shared'
import { generateCode } from './gen'
import { generateJSON, generateYAML } from './generator'

import type { CodeGenOptions, DevEnv } from './generator/codegen'
import type { VueI18nLoaderOptions } from './options'

const loader: webpack.loader.Loader = function (
  source: string | Buffer,
  sourceMap: RawSourceMap | undefined
): void {
  const loaderContext = this // eslint-disable-line @typescript-eslint/no-this-alias
  const loaderOptions = loaderUtils.getOptions(loaderContext) || {}
  const query = parse(this.resourceQuery)

  if (!isEmptyObject(query)) {
    try {
      this.cacheable && this.cacheable()
      const code = `${generateCode(
        source,
        query,
        loaderOptions as VueI18nLoaderOptions
      )}`
      this.callback(null, code, sourceMap)
    } catch (err) {
      this.emitError(`[vue-i18n-loader]: ${err.message}`)
    }
  } else {
    const { ext } = path.parse(loaderContext.resourcePath)
    const { resourcePath: filename, mode } = loaderContext
    const { forceStringify } = loaderOptions as VueI18nLoaderOptions

    if (/\.(json5?|ya?ml)/.test(ext)) {
      const options: CodeGenOptions = {
        filename,
        forceStringify,
        sourceMap: loaderContext.sourceMap,
        env: mode as DevEnv,
        onWarn: (msg: string): void => {
          loaderContext.emitWarning(
            `[vue-i18n-loader]: ${loaderContext.resourcePath} ${msg}`
          )
        },
        onError: (msg: string): void => {
          loaderContext.emitError(
            `[vue-i18n-loader]: ${loaderContext.resourcePath} ${msg}`
          )
        }
      }
      const generate = /\.json5?/.test(ext) ? generateJSON : generateYAML
      const { code, map } = generate(source, options)
      this.callback(null, code, map)
    } else {
      this.callback(null, source, sourceMap)
    }
  }
}

export default loader
