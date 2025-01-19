import process from 'node:process'
import { createJiti } from 'jiti'
import { describe, expect, it } from 'vitest'
import { findUpInGitRootDir } from '../src/utils'

describe.skip('test', () => {
  it('should work', () => {
    function tryRequire(id: string) {
      const _require = createJiti(process.cwd(), { interopDefault: true }).import
      try {
        return _require(id)
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return {}
      }
    }

    const config = tryRequire('./.flowmitrc')
    expect(config).toMatchInlineSnapshot(`{}`)
  })
})

describe.skip('find up flowmit.config.ts', () => {
  it('should work', async () => {
    const configPath = await findUpInGitRootDir(['flowmit.config.ts', 'flowmit.config.js'])
    expect(configPath).toMatchInlineSnapshot(`"D:\\CODE\\mine\\flowmit\\flowmit.config.ts"`)
  })
})
