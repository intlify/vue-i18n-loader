# :globe_with_meridians: vue-i18n-loader

[![CircleCI](https://circleci.com/gh/kazupon/vue-i18n-loader.svg?style=svg)](https://circleci.com/gh/kazupon/vue-i18n-loader)
[![codecov](https://codecov.io/gh/kazupon/vue-i18n-loader/branch/dev/graph/badge.svg)](https://codecov.io/gh/kazupon/vue-i18n-loader)
[![npm](https://img.shields.io/npm/v/@kazupon/vue-i18n-loader.svg)](https://www.npmjs.com/package/@kazupon/vue-i18n-loader)

vue-i18n loader for custom blocks

## :cd: Installation

    $ npm i --save-dev @kazupon/vue-i18n-loader

## :rocket: Usage

the below example that`App.vue` have `i18n` custom block:

### Custom Blocks (Single File Components)
```html
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

configure webpack config for `vue-loader` (v11.3 later):

```javascript
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
