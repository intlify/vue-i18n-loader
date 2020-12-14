/**
 * Code generator for YAML i18n resource
 */

import { isString, isBoolean } from '@intlify/shared'
import { createCodeGenerator } from './codegen'

import type { CodeGenOptions, CodeGenerator, CodeGenResult } from './codegen'

export function generate(
  targetSource: string | Buffer,
  {
    filename = 'vue-i18n-loader.yaml',
    sourceMap = false,
    env = 'development'
  }: CodeGenOptions
): CodeGenResult<any> {
  const target = isString(targetSource) ? targetSource : targetSource.toString()

  const generator = createCodeGenerator({ filename, sourceMap, env })

  // TODO:
  // const ast = parseJSON(value)
  // generateNode(generator, ast)
  const ast = {}
  generateNode(generator, ast)

  const { code, map } = generator.context()
  return {
    ast,
    code,
    map: map ? (map as any).toJSON() : undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

function generateNode(generator: CodeGenerator, node: any): void {
  // TODO:
}
