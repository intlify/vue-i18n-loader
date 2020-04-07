<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'App'
}
</script>

<i18n>
{
  "en": {
    "hello": "hello, world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
