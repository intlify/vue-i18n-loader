import path from 'path'
import webpack from 'webpack'
import memoryfs from 'memory-fs'
import { JSDOM, VirtualConsole } from 'jsdom'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

export function bundle (fixture, options = {}) {
  const compiler = webpack({
    mode: 'development',
    devtool: false,
    entry: path.resolve(__dirname, './fixtures/entry.js'),
    resolve: {
      alias: {
        '~target': path.resolve(__dirname, './fixtures', fixture)
      }
    },
    output: {
      path: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: path.resolve(__dirname, '../src/index.js')
      }]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  })

  const mfs = new memoryfs() // eslint-disable-line
  compiler.outputFileSystem = mfs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors))
      resolve({ code: mfs.readFileSync('/bundle.js').toString(), stats })
    })
  })
}

export async function bundleAndRun (fixture, options = {}) {
  const { code, stats } = await bundle(fixture, options)

  let dom, jsdomError
  try {
    dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
      runScripts: 'outside-only',
      virtualConsole: new VirtualConsole()
    })
    dom.window.eval(code)
  } catch (e) {
    console.error(`JSDOM error:\n${e.stack}`)
    jsdomError = e
  }

  const { window } = dom
  const { module, exports } = window
  const instance = {}
  if (module && module.beforeCreate) {
    module.beforeCreate.forEach(hook => hook.call(instance))
  }

  return Promise.resolve({ window, module, exports, instance, code, jsdomError, stats })
}
