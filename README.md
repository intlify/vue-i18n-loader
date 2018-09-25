<p align="center"><img width="373px" height="168px" src="./assets/vue-i18n-loader.png" alt="Vue I18n Loader logo"></p>

<h1 align="center">vue-i18n-loader</h1>

<p align="center">
  <a href="https://circleci.com/gh/kazupon/vue-i18n-loader"><img src="https://circleci.com/gh/kazupon/vue-i18n-loader.svg?style=svg" alt="Build Status"></a>
  <a href="https://codecov.io/gh/kazupon/vue-i18n-loader"><img src="https://codecov.io/gh/kazupon/vue-i18n-loader/branch/dev/graph/badge.svg" alt="codecov"></a>
  <a href="https://www.npmjs.com/package/@kazupon/vue-i18n-loader"><img src="https://img.shields.io/npm/v/@kazupon/vue-i18n-loader.svg" alt="npm"></a>
</p>

<p align="center">vue-i18n loader for custom blocks</p>

<br/>

## :cd: Installation

    $ npm i --save-dev @kazupon/vue-i18n-loader

## :rocket: Usage

the below example that`App.vue` have `i18n` custom block:

### Custom Blocks (Single File Components)
```vue
<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
</i18n>

<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'app',
  // ...
}
</script>
```

### JavaScript

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      // ...
    },
    ja: {
      // ...
    }
  }
})
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
```

### Webpack Config 

`vue-loader` (v15 or later):

```javascript
// for vue.config.js (Vue CLI)
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
  }
}
```

`vue-loader` (v15 or later):

```javascript
// for webpack.config.js (Without Vue CLI)
module.exports = {
  module: {
    rules: [
      {
        resourceQuery: /blockType=i18n/,
        loader: '@kazupon/vue-i18n-loader',
      },
    ]
  }
}
```

`vue-loader` (~v14.x):

```javascript
// for webpack config file
module.exports = {
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue',
      options: {
        loaders: {
          i18n: '@kazupon/vue-i18n-loader'
        }
      }
    }]
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/kazupon/vue-i18n-loader/blob/dev/CHANGELOG.md).

## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/kazupon/vue-i18n-loader/blob/dev/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
