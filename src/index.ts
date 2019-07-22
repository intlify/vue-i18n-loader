import webpack from 'webpack'
import { ParsedUrlQuery, parse } from 'querystring'
import { RawSourceMap } from 'source-map'
import JSON5 from 'json5'
import yaml from 'js-yaml'

const loader: webpack.loader.Loader = function (
  source: string | Buffer, sourceMap: RawSourceMap | undefined): void {
  if (this.version && Number(this.version) >= 2) {
    try {
      this.cacheable && this.cacheable()
      this.callback(null, `module.exports = ${generateCode(source, parse(this.resourceQuery))}`, sourceMap)
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

function generateCode (source: string | Buffer, query: ParsedUrlQuery): string {
  const data = convert(source, query.lang as string)
  let value = JSON.parse(data)

  if (query.locale && typeof query.locale === 'string') {
    value = Object.assign({}, { [query.locale]: value })
  }

  value = JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/\\/g, '\\\\')

  let code = ''
  code += `function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('${value.replace(/\u0027/g, '\\u0027')}')
  delete Component.options._Ctor
}\n`
  return code
}

function convert (source: string | Buffer, lang: string): string {
  const value = Buffer.isBuffer(source) ? source.toString() : source

  switch (lang) {
    case 'yaml':
    case 'yml':
      const data = yaml.safeLoad(value)
      return JSON.stringify(data, undefined, '\t')
    case 'json5':
      return JSON.stringify(JSON5.parse(value))
    default:
      return value
  }
}

export default loader
