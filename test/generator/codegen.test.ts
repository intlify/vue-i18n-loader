import { generateMessageFunction } from '../../src/generator/codegen'

describe('generateMessageFunction', () => {
  test('development', () => {
    expect(
      generateMessageFunction('hello', {
        sourceMap: true
      })
    ).toMatchSnapshot()
  })

  test('production', () => {
    expect(
      generateMessageFunction('hello', { env: 'production' })
    ).toMatchSnapshot()
  })
})
