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

test('locale attr', async () => {
  const { module } = await bundleAndRun('locale.vue')
  expect(module.__i18n).toMatchSnapshot()
})

test('locale attr and basic', async () => {
  const { module } = await bundleAndRun('locale-mix.vue')
  expect(module.__i18n).toMatchSnapshot()
})

test('locale attr and import', async () => {
  const { module } = await bundleAndRun('locale-import.vue')
  expect(module.__i18n).toMatchSnapshot()
})
