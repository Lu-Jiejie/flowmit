import { describe, expect, it } from 'vitest'
import jiti from 'jiti'
import type { Options } from '../src/config'

describe('test', () => {
  it('should work', () => {
    function tryRequire(id: string) {
      const _require = jiti(process.cwd(), { interopDefault: true, esmResolve: true })
      try {
        return _require(id)
      }
      catch (error) {
        return {}
      }
    }

    const config = tryRequire('./.flowmitrc')
    expect(config).toMatchInlineSnapshot(`{}`)
  })
})
