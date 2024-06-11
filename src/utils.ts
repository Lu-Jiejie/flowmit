import process from 'node:process'
import path from 'node:path'
import jiti from 'jiti'
import { findUp } from 'find-up'

export function tryRequire(name: string, path: string) {
  const _require = jiti(path, { interopDefault: true, esmResolve: true })
  try {
    return _require(name)
  }
  catch (error) {
    return {}
  }
}

export async function getGitRootDir(cwd = process.cwd()) {
  const gitFolder = await findUp('.git', { cwd, type: 'directory' })
  return gitFolder ? path.dirname(gitFolder) : null
}

export async function findUpInGitRootDir(name: string | string[], type: 'file' | 'directory' = 'file') {
  const gitRootDir = await getGitRootDir()
  if (!gitRootDir)
    return undefined
  return await findUp(name, { type, stopAt: gitRootDir })
}
