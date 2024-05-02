import path from 'node:path'
import process from 'node:process'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import type { Config } from './types'

export const defaultConfig: Config = {
  types: [
    { title: 'feat', value: 'feat', description: '新功能' },
    { title: 'fix', value: 'fix', description: '修复 bug' },
    { title: 'docs', value: 'docs', description: '修改文档' },
    { title: 'style', value: 'style', description: '修改代码格式' },
    { title: 'refactor', value: 'refactor', description: '代码重构' },
    { title: 'perf', value: 'perf', description: '性能优化' },
    { title: 'test', value: 'test', description: '修改测试用例' },
    { title: 'build', value: 'build', description: '修改构建配置' },
    { title: 'chore', value: 'chore', description: '构建过程或辅助工具的变动' },
    { title: 'revert', value: 'revert', description: '回滚某个更早的提交' },
  ],
}

export function defineConfig(config: Config) {
  return config
}

export async function _getConfig(pkgAliasName: string = 'fm'): Promise<Config> {
  const rcName = `.${pkgAliasName}rc`
  const jsName = `${pkgAliasName}.config.js`

  // search in current cwd
  const cwd = process.cwd()
  const cwdJsPath = path.resolve(cwd, jsName)
  const cwdRcPath = path.resolve(cwd, rcName)
  if (fs.existsSync(cwdJsPath))
    return (await import((pathToFileURL(cwdJsPath).href))).default || {}
  if (fs.existsSync(cwdRcPath))
    return JSON.parse(fs.readFileSync(cwdRcPath, 'utf-8')) || {}

  // search in global
  const customRcPath = process.env.FM_CONFIG_PATH
  const home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
  const defaultRcPath = path.join(home || '~/', rcName)
  const globalRcPath = customRcPath || defaultRcPath
  if (fs.existsSync(globalRcPath))
    return JSON.parse(fs.readFileSync(globalRcPath, 'utf-8')) || {}

  return {}
}

export async function getConfig(): Promise<Config> {
  return Object.assign({}, defaultConfig, await _getConfig())
}
