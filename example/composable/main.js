import { createApp } from 'vue'
import { createI18nComposer } from 'vue-i18n'
import App from './App.vue'

const i18n = createI18nComposer({
  locale: 'ja',
  messages: {}
})

const app = createApp(App)

app.use(i18n)
app.mount('#app')
