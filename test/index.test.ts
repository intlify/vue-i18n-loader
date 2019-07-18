import { bundleAndRun } from './utils'

test('basic', async () => {
  const { module } = await bundleAndRun('basic.vue')
  expect(module.__i18n).toMatchSnapshot()
})

test('special characters', async () => {
  const { module } = await bundleAndRun('special-char.vue')
  expect(module.__i18n).toMatchSnapshot()
})

test('multiple', async () => {
  const { module } = await bundleAndRun('multiple.vue')
  expect(module.__i18n).toMatchSnapshot()
})

test('import', async () => {
  const { module } = await bundleAndRun('import.vue')
  expect(module.__i18n).toMatchSnapshot()
})
