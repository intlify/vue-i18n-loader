import { isObject, isString } from '@intlify/shared'
import { VisitorKeys } from 'eslint-visitor-keys'
import { parseForESLint, VisitorKeys as VISITOR_KEYS } from 'yaml-eslint-parser'

import type { YAMLProgram, YAMLNode } from 'yaml-eslint-parser/lib/ast'

export interface Visitor<N> {
  visitorKeys?: VisitorKeys
  enterNode(node: N, parent: N | null): void
  leaveNode(node: N, parent: N | null): void
}

export function parseYAML(code: string, options = {}): YAMLProgram {
  const parserOptions = Object.assign(
    {
      filePath: '<input>',
      ecmaVersion: 2019
    },
    options,
    {
      loc: true,
      range: true,
      raw: true,
      tokens: true,
      comment: true,
      eslintVisitorKeys: true,
      eslintScopeManager: true
    }
  )

  return parseForESLint(code, parserOptions).ast
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fallbackKeysFilter(this: any, key: string) {
  let value = null
  return (
    key !== 'comments' &&
    key !== 'sourceType' &&
    key !== 'loc' &&
    key !== 'parent' &&
    key !== 'range' &&
    key !== 'tokens' &&
    (value = this[key]) !== null &&
    isObject(value) &&
    (isString(value.type) || Array.isArray(value))
  )
}

function getFallbackKeys(node: YAMLNode): string[] {
  return Object.keys(node).filter(fallbackKeysFilter, node)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNode(x: any): x is YAMLNode {
  return x !== null && isObject(x) && isString(x.type)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function* getNodes(node: any, key: string): IterableIterator<YAMLNode> {
  const child = node[key]
  if (Array.isArray(child)) {
    for (const c of child) {
      if (isNode(c)) {
        yield c
      }
    }
  } else if (isNode(child)) {
    yield child
  }
}

function getKeys(node: YAMLNode, visitorKeys?: VisitorKeys) {
  const keys = (visitorKeys || VISITOR_KEYS)[node.type] || getFallbackKeys(node)
  return keys.filter((key: string) => !getNodes(node, key).next().done)
}

function traverse(
  node: YAMLNode,
  parent: YAMLNode | null,
  visitor: Visitor<YAMLNode>
) {
  visitor.enterNode(node, parent)
  const keys = getKeys(node, visitor.visitorKeys)
  for (const key of keys) {
    for (const child of getNodes(node, key)) {
      traverse(child, node, visitor)
    }
  }
  visitor.leaveNode(node, parent)
}

export function traverseNodes(
  node: YAMLNode,
  visitor: Visitor<YAMLNode>
): void {
  traverse(node, null, visitor)
}
