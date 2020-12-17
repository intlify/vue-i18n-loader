describe.skip(`global`, () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:8080/global/`)
  })

  test('initial rendering', async () => {
    await expect(page).toMatch('言語')
    await expect(page).toMatch('こんにちは、世界！')
  })

  test('change locale', async () => {
    await page.select('#app select', 'en')
    await expect(page).toMatch('Language')
    await expect(page).toMatch('hello, world!')
  })
})
