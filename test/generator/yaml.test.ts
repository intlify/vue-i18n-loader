import { readFile } from '../utils'
import { generate } from '../../src/generator/yaml'
;['yaml', 'yml'].forEach(format => {
  test(format, async () => {
    const { source } = await readFile(`./fixtures/codegen/complex.${format}`)
    const { code, map } = generate(source, {
      sourceMap: true,
      env: 'development'
    })

    expect(code).toMatchSnapshot('code')
    expect(map).toMatchSnapshot('map')
  })
})
