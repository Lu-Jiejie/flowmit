import process from 'node:process'
import jiti from 'jiti'

export function tryRequire(name: string, path: string) {
  const _require = jiti(path, { interopDefault: true, esmResolve: true })
  try {
    return _require(name)
  }
  catch (error) {
    return {}
  }
}
