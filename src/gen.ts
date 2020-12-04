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
  const value = merge(parse(source, query), query)

  let code = ''
  const preCompile = !!options.preCompile

  if (preCompile) {
    if (query.global) {
      console.warn(
        '[vue-i18n-loader] cannot support global scope for pre-compilation'
      )
    } else {
      code += generateCompiledCode(value as LocaleMessages)
      code += `export default function (Component) {
  Component.__i18n = Component.__i18n || _getResource
}\n`
    }
  } else {
    const variableName = query.global ? '__i18nGlobal' : '__i18n'
    code += `export default function (Component) {
  Component.${variableName} = Component.${variableName} || []
  Component.${variableName}.push(${stringify(value)})
}\n`
  }

  return prettier.format(code, { parser: 'babel' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stringify(data: any): string {
  return friendlyJSONstringify(data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function merge(data: any, query: ParsedUrlQuery): any {
  if (query.locale && typeof query.locale === 'string') {
    return Object.assign({}, { [query.locale]: data })
  } else {
    return data
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parse(source: string | Buffer, query: ParsedUrlQuery): any {
  const value = Buffer.isBuffer(source) ? source.toString() : source
  const { lang } = query
  switch (lang) {
    case 'yaml':
    case 'yml':
      return yaml.safeLoad(value)
    case 'json5':
      return JSON5.parse(value)
    default:
      return JSON.parse(value)
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
