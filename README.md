<p align="center"><img width="373px" height="168px" src="./assets/vue-i18n-loader.png" alt="Vue I18n Loader logo"></p>

<h1 align="center">@intlify/vue-i18n-loader</h1>

<p align="center">
  <a href="https://github.com/intlify/vue-i18n-loader/actions?query=workflow%3ATest"><img src="https://github.com/intlify/vue-i18n-loader/workflows/Test/badge.svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@intlify/vue-i18n-loader"><img src="https://img.shields.io/npm/v/@intlify/vue-i18n-loader.svg" alt="npm"></a>
  <a href="https://devtoken.rocks/package/@intlify/vue-i18n-loader"><img src="https://badge.devtoken.rocks/@intlify/vue-i18n-loader" alt="@intlify/vue-i18n-loader Dev Token"/></a>
</p>

<p align="center">vue-i18n loader for custom blocks</p>

**NOTE:** :warning: This `next` branch is development branch for Vue 3! The stable version is now in [`master`](https://github.com/intlify/vue-i18n-loader/tree/master) branch!

## Status: Alpha ![Test](https://github.com/intlify/vue-i18n-loader/workflows/Test/badge.svg)

<br/>

## :star: Features
- `i18n` custom block
  - i18n resource definition
  - i18n resource importing
  - Locale of i18n resource definition
  - i18n resource formatting
- i18n resource optimaization


## :cd: Installation

### NPM

```sh
$ npm i --save-dev @intlify/vue-i18n-extensions@alpha
```

### YARN

```sh
$ yarn add -D @intlify/vue-i18n-extensions@alpha
```

## :rocket: `i18n` custom block

the below example that`App.vue` have `i18n` custom block:

### i18n resource definition

```vue
<template>
  <p>{{ t('hello') }}</p>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'app',
  setup() {
    // Somthing todo ...
    return {
      ...,
      ...useI18n({
        // ...
      })
    }
  }
}
</script>

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
```

The locale messages defined at `i18n` custom blocks are **json format default**.

### i18n resource importing

you also can use `src` attribute:

```vue
<i18n src="./myLang.json"></i18n>
```

```json5
// ./myLnag.json
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
```

### Locale of i18n resource definition

You can define locale messages for each locale with `locale` attribute in single-file components:

```vue
<i18n locale="en">
{
  "hello": "hello world!"
}
</i18n>

<i18n locale="ja">
{
  "hello": "こんにちは、世界!"
}
</i18n>
```

The above defines two locales, which are merged at target single-file components.


### i18n resource formatting

Besides json format, You can be used by specifying the following format in the `lang` attribute:

- yaml
- json5

example yaml foramt:

```vue
<i18n locale="en" lang="yaml">
  hello: "hello world!"
</i18n>

<i18n locale="ja" lang="yml">
  hello: "こんにちは、世界！"
</i18n>
```

example json5 format:

```vue
<i18n lang="json5">
{
  "en": {
    // comments
    "hello": "hello world!"
  }
}
</i18n>
```

### JavaScript

```javascript
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

// setup i18n instance with globaly
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      // ...
    },
    ja: {
      // ...
    }
  }
})

const app = createApp(App)

app.use(i18n)
app.mount('#app')
```

### Webpack Config

`vue-loader` (`next` version):

```javascript
module.exports = {
  module: {
    rules: [
      // ...
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      },
      // ...
    ]
  }
}
```

## :rocket: i18n resource optimazation

You can optimize your localization performance with pre-compiling the i18n resources.

You need to specify the `preCompile: true` option in your webpack config as below:

```javascript
module.exports = {
  module: {
    rules: [
      // ...
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        use: [
          {
            loader: '@intlify/vue-i18n-loader',
            options: {
              preCompile: true // you need to specify at here!
            }
          }
        ]
      },
      // ...
    ]
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/intlify/vue-i18n-loader/blob/master/CHANGELOG.md).

## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/intlify/vue-i18n-loader/blob/master/.github/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
