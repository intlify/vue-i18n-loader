import { ParsedUrlQuery } from 'querystring'
import JSON5 from 'json5'
import yaml from 'js-yaml'
import { flatten } from 'flat'
import prettier from 'prettier'
import {
  baseCompile,
  LocaleMessages,
  Locale,
  CompileOptions,
  generateFormatCacheKey,
  friendlyJSONstringify
} from 'vue-i18n'

export type VueI18nLoaderOptions = {
  preCompile?: boolean
}

export function generateCode(
  source: string | Buffer,
  query: ParsedUrlQuery,
  options: VueI18nLoaderOptions
): string {
  const data = convert(source, query.lang as string)
  let value = JSON.parse(data)

  if (query.locale && typeof query.locale === 'string') {
    value = Object.assign({}, { [query.locale]: value })
  }

  let code = ''
  const preCompile = !!options.preCompile

  if (preCompile) {
    code += generateCompiledCode(value as LocaleMessages)
    code += `export default function (Component) {
  Component.__i18n = Component.__i18n || _getResource
}\n`
  } else {
    value = friendlyJSONstringify(value)
    code += `export default function (Component) {
  Component.__i18n = Component.__i18n || []
  Component.__i18n.push('${value}')
}\n`
  }

  return prettier.format(code, { parser: 'babel' })
}

function convert(source: string | Buffer, lang: string): string {
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

function generateCompiledCode(messages: LocaleMessages): string {
  let code = ''
  code += `function _register(functions, pathkey, msg) {
  const path = JSON.stringify(pathkey)
  functions[path] = msg
}
`
  code += `const _getResource = () => {
  const functions = Object.create(null)
`

  const locales = Object.keys(messages) as Locale[]
  locales.forEach(locale => {
    const message = flatten(messages[locale]) as { [key: string]: string }
    const keys = Object.keys(message)
    keys.forEach(key => {
      const format = message[key]
      let occured = false
      const options = {
        mode: 'arrow',
        // TODO: source mapping !
        onError(err) {
          console.error(err)
          occured = true
        }
      } as CompileOptions
      const result = baseCompile(format, options)
      if (!occured) {
        code += `  _register(functions, ${generateFormatCacheKey(
          locale,
          key,
          format
        )}, ${result.code})\n`
      }
    })
  })

  code += `
  return { functions }
}
`

  return code
}
