import { generateMessageFunction } from '../../src/generator/codegen'

describe('generateMessageFunction', () => {
  test('development', () => {
    expect(generateMessageFunction('hello', 'development')).toMatchSnapshot()
  })

  test('production', () => {
    expect(generateMessageFunction('hello', 'production')).toMatchSnapshot()
  })
})
