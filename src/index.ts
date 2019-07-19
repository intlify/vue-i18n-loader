import webpack from 'webpack'
import { ParsedUrlQuery, parse } from 'querystring'

const loader: webpack.loader.Loader = function (source: string | Buffer): void {

  if (this.version && Number(this.version) >= 2) {
    try {
      this.cacheable && this.cacheable()
      this.callback(null, `module.exports = ${generateCode(source, parse(this.resourceQuery))}`)
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
  let code = ''

  let value = typeof source === 'string'
    ? JSON.parse(source)
    : Buffer.isBuffer(source)
      ? JSON.parse(source.toString())
      : null
  if (value === null) { throw new Error('invalid source!') }

  if (query.locale && typeof query.locale === 'string') {
    value = Object.assign({}, { [query.locale]: value })
  }

  value = JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/\\/g, '\\\\')

  code += `function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('${value.replace(/\u0027/g, '\\u0027')}')
  delete Component.options._Ctor
}\n`
  return code
}

export default loader
