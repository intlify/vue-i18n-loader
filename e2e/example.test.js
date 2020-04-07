describe('example', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/')
  })

  test('rendering', async () => {
    await expect(page).toMatch('こんにちは、世界！')
  })
})
