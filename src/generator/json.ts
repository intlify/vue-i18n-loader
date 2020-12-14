/**
 * Code generator for JSON i18n resource
 */

import { parseJSON, traverseNodes } from 'jsonc-eslint-parser'
import { isString } from '@intlify/shared'
import { createCodeGenerator, generateMessageFunction } from './codegen'

import type { JSONProgram, JSONNode } from 'jsonc-eslint-parser/lib/parser/ast'
import type { CodeGenOptions, CodeGenerator, CodeGenResult } from './codegen'

export function generate(
  targetSource: string | Buffer,
  {
    filename = 'vue-i18n-loader.json',
    sourceMap = false,
    env = 'development',
    forceStringify = false
  }: CodeGenOptions
): CodeGenResult<JSONProgram> {
  const target = isString(targetSource) ? targetSource : targetSource.toString()
  // const value = JSON.stringify(JSON.parse(target))
  //   .replace(/\u2028/g, '\\u2028') // line separator
  //   .replace(/\u2029/g, '\\u2029') // paragraph separator
  const value = target
  // console.log('options', options)

  const generator = createCodeGenerator({
    source: value,
    sourceMap,
    env,
    filename,
    forceStringify
  })

  const ast = parseJSON(value, { filePath: filename })
  generateNode(generator, ast)

  const { code, map } = generator.context()
  return {
    ast,
    code,
    map: map ? (map as any).toJSON() : undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

function generateNode(generator: CodeGenerator, node: JSONProgram): void {
  const propsCountStack = [] as number[]
  const itemsCountStack = [] as number[]
  const { env, forceStringify } = generator.context()

  traverseNodes(node, {
    enterNode(node: JSONNode, parent: JSONNode) {
      // console.log('enterNdoe', node.type, node.loc)
      // if (parent) {
      //   console.log('enterNode parent', parent.type)
      // }
      switch (node.type) {
        case 'Program':
          generator.push(`export default `)
          break
        case 'JSONObjectExpression':
          generator.push(`{`)
          generator.indent()
          // const b1 = propsCountStack.concat()
          propsCountStack.push(node.properties.length)
          // const c1 = propsCountStack.concat()
          // console.log(`propsCountStack: ${b1} -> ${c1}`)
          if (parent.type === 'JSONArrayExpression') {
            const lastIndex = itemsCountStack.length - 1
            itemsCountStack[lastIndex] = --itemsCountStack[lastIndex]
            // console.log(
            //   'itemsCountStack enter in JSONProperty',
            //   itemsCountStack
            // )
          }
          break
        case 'JSONProperty':
          if (
            node.value.type === 'JSONLiteral' &&
            (node.key.type === 'JSONLiteral' || node.key.type === 'JSONIdentifier')
          ) {
            const name = node.key.type === 'JSONLiteral' ? node.key.value : node.key.name
            if (isString(node.value.value)) {
              generator.push(`${JSON.stringify(name)}: `)
              generator.push(
                `${generateMessageFunction(node.value.value, env)}`,
                node
              )
            } else {
              if (forceStringify) {
                generator.push(`${JSON.stringify(name)}: `)
                generator.push(
                  `${generateMessageFunction(
                    JSON.stringify(node.value.value),
                    env
                  )}`,
                  node
                )
              } else {
                generator.push(`${JSON.stringify(name)}: ${JSON.stringify(node.value.value)}`)
              }
            }
          } else if (
            (node.value.type === 'JSONObjectExpression' ||
              node.value.type === 'JSONArrayExpression') &&
            (node.key.type === 'JSONLiteral' || node.key.type === 'JSONIdentifier')
          ) {
            const name = node.key.type === 'JSONLiteral' ? node.key.value : node.key.name
            generator.push(`${JSON.stringify(name)}: `)
          }
          const lastIndex = propsCountStack.length - 1
          // console.log('lastindex', lastIndex, propsCountStack[lastIndex])
          propsCountStack[lastIndex] = --propsCountStack[lastIndex]
          // console.log('propsCountStack leave in JSONProperty', propsCountStack)
          break
        case 'JSONArrayExpression':
          generator.push(`[`)
          generator.indent()
          // const b2 = itemsCountStack.concat()
          itemsCountStack.push(node.elements.length)
          // const c2 = itemsCountStack.concat()
          // console.log(`itemsCountStack: ${b2} -> ${c2}`)
          break
        case 'JSONLiteral':
          if (parent.type === 'JSONArrayExpression') {
            if (node.type === 'JSONLiteral') {
              if (isString(node.value)) {
                generator.push(
                  `${generateMessageFunction(node.value, env)}`,
                  node
                )
              } else {
                if (forceStringify) {
                  generator.push(
                    `${generateMessageFunction(
                      JSON.stringify(node.value),
                      env
                    )}`,
                    node
                  )
                } else {
                  generator.push(`${JSON.stringify(node.value)}`)
                }
              }
            }
            const lastIndex = itemsCountStack.length - 1
            // console.log('lastindex', lastIndex, itemsCountStack[lastIndex])
            itemsCountStack[lastIndex] = --itemsCountStack[lastIndex]
            // console.log('itemsCountStack enter in JSONLiteral', itemsCountStack)
          }
          break
        default:
          break
      }
    },
    leaveNode(node: JSONNode, parent: JSONNode) {
      // console.log('leaveNode', node.type)
      switch (node.type) {
        case 'Program':
          // generator.deindent()
          // generator.push(`}`)
          break
        case 'JSONObjectExpression':
          if (propsCountStack[propsCountStack.length - 1] === 0) {
            propsCountStack.pop()
          }
          generator.deindent()
          generator.push(`}`)
          if (parent.type === 'JSONArrayExpression') {
            if (itemsCountStack[itemsCountStack.length - 1] !== 0) {
              generator.pushline(`,`)
            }
          }
          break
        case 'JSONProperty':
          if (propsCountStack[propsCountStack.length - 1] !== 0) {
            generator.pushline(`,`)
          }
          break
        case 'JSONArrayExpression':
          if (itemsCountStack[itemsCountStack.length - 1] === 0) {
            itemsCountStack.pop()
          }
          generator.deindent()
          generator.push(`]`)
          break
        case 'JSONLiteral':
          if (parent.type === 'JSONArrayExpression') {
            if (itemsCountStack[itemsCountStack.length - 1] !== 0) {
              generator.pushline(`,`)
            }
          }
          break
        default:
          break
      }
    }
  })
}
