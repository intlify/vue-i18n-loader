import test from 'ava'
import VueI18nLoader from '../src/index'

function Loader (content, version) {
  this.version = version
  VueI18nLoader.call(this, content)
}
Loader.prototype = Object.create(Loader.prototype)
Loader.prototype.constructor = Loader
Loader.prototype.cacheable = function () {}
Loader.prototype.callback = function (err, content) {
  this._callback = { err, content }
}
Loader.prototype.emitError = function (message) {
  this._emitError = message
}

function assert (t, content) {
  const loader = new Loader(content, 2)
  t.deepEqual(
    loader._callback.content, `module.exports = function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('{\"en\":{\"hello\":\"hello world!\"}}')
}\n`
  )
}

function assertSpecial (t, content) {
  const loader = new Loader(content, 2)
  t.deepEqual(
    loader._callback.content, `module.exports = function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('{\"en\":{\"hello\":\"hello\\\\ngreat\\\\t\\\\\"world\\\\\"\"}}')
}\n`
  )
}

test('string', t => {
  const json = JSON.stringify({
    en: {
      'hello': 'hello world!'
    }
  })

  assert(t, json)
})

test('object', t => {
  const json = {
    en: {
      'hello': 'hello world!'
    }
  }

  assert(t, json)
})

test('string with special characters', t => {
  const json = JSON.stringify({
    en: {
      'hello': 'hello\ngreat\t"world"'
    }
  })

  assertSpecial(t, json)
})

test('object with special characters', t => {
  const json = {
    en: {
      'hello': 'hello\ngreat\t"world"'
    }
  }

  assertSpecial(t, json)
})

test('version 2 less', t => {
  const loader = new Loader({})
  t.deepEqual(loader._emitError, 'support webpack 2 later')
  t.deepEqual(
    loader._callback.err.message,
    'support webpack 2 later'
  )
})
