import process from 'node:process'
import path from 'node:path'
import { stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
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

interface FindUpOptions {
  cwd?: string
  stopAt?: string
  type?: 'file' | 'directory'
}

export async function findUp(paths: string | string[], options: FindUpOptions = {}) {
  const {
    cwd = process.cwd(),
    stopAt = path.parse(cwd).root,
    type = 'file',
  } = options

  let currentDir = cwd

  while (currentDir && currentDir !== stopAt) {
    for (const p of paths) {
      const filePath = path.resolve(currentDir, p)
      if (existsSync(filePath) && (await stat(filePath)).isFile() === (type === 'file'))
        return filePath
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir)
      break
    currentDir = parentDir
  }

  return undefined
}
