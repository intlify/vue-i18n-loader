import { LocationStub } from '@intlify/message-compiler'
import { SourceMapGenerator } from 'source-map'

import type { RawSourceMap } from 'source-map'

export type DevEnv = 'development' | 'production'

interface Position {
  line: number
  column: number
  offset?: number
}

export interface SourceLocationable {
  loc?: {
    start: Position
    end: Position
  }
}

export interface CodeGenOptions {
  source?: string
  sourceMap?: boolean
  filename?: string
  env?: DevEnv
  forceStringify?: boolean
  onWarn?: (msg: string) => void
  onError?: (msg: string) => void
}

export interface CodeGenContext {
  source?: string
  code: string
  indentLevel: number
  filename: string
  line: number
  column: number
  offset: number
  env: DevEnv
  forceStringify: boolean
  map?: SourceMapGenerator
}

export interface CodeGenerator {
  context(): CodeGenContext
  push<Node extends SourceLocationable>(code: string, node?: Node): void
  indent(withNewLine?: boolean): void
  deindent(withNewLine?: boolean): void
  newline(): void
  pushline<Node extends SourceLocationable>(code: string, node?: Node): void
}

export interface CodeGenResult<ASTNode> {
  code: string
  ast: ASTNode
  map?: RawSourceMap
}

export function createCodeGenerator(
  options: CodeGenOptions = {
    filename: 'bundle.json',
    sourceMap: false,
    env: 'development',
    forceStringify: false
  }
): CodeGenerator {
  // console.log('createCodeGenerator', options)
  const { sourceMap, source, filename } = options
  const _context = Object.assign(
    {
      code: '',
      column: 1,
      line: 1,
      offset: 0,
      map: undefined,
      indentLevel: 0
    },
    options
  ) as CodeGenContext

  const context = (): CodeGenContext => _context

  function push<Node extends SourceLocationable>(
    code: string,
    node?: Node
  ): void {
    _context.code += code
    // console.log('code', _context.code)
    if (_context.map) {
      if (node && node.loc && node.loc !== LocationStub) {
        addMapping(node.loc.start)
      }
      advancePositionWithSource(_context as Position, code)
    }
  }

  function _newline(n: number): void {
    push('\n' + `  `.repeat(n))
  }

  function indent(withNewLine = true): void {
    const level = ++_context.indentLevel
    withNewLine && _newline(level)
  }

  function deindent(withNewLine = true): void {
    const level = --_context.indentLevel
    withNewLine && _newline(level)
  }

  function newline(): void {
    _newline(_context.indentLevel)
  }

  function pushline<Node extends SourceLocationable>(
    code: string,
    node?: Node
  ): void {
    push(code, node)
    newline()
  }

  function addMapping(loc: Position, name?: string) {
    _context.map!.addMapping({
      name,
      source: _context.filename,
      original: {
        line: loc.line,
        column: loc.column - 1
      },
      generated: {
        line: _context.line,
        column: _context.column - 1
      }
    })
  }

  if (sourceMap && source) {
    _context.map = new SourceMapGenerator()
    _context.map.setSourceContent(filename!, source)
  }

  return {
    context,
    push,
    indent,
    deindent,
    newline,
    pushline
  }
}

function advancePositionWithSource(
  pos: Position,
  source: string,
  numberOfCharacters: number = source.length
): Position {
  if (pos.offset == null) {
    return pos
  }

  let linesCount = 0
  let lastNewLinePos = -1
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      linesCount++
      lastNewLinePos = i
    }
  }

  pos.offset += numberOfCharacters
  pos.line += linesCount
  pos.column =
    lastNewLinePos === -1
      ? pos.column + numberOfCharacters
      : numberOfCharacters - lastNewLinePos

  return pos
}

export function generateMessageFunction(msg: string, env: DevEnv): string {
  // TODO: implement compilation with @intlify/message-compiler
  return env === 'development'
    ? `(() => { const fn = () => ${JSON.stringify(
        msg
      )}; fn.source = ${JSON.stringify(msg)}; return fn; })()`
    : `() => ${JSON.stringify(msg)}`
}
