import path from 'node:path'
import process from 'node:process'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import type { Config } from './types'

export const defaultTypes = [
  { title: 'feat', value: 'feat', description: 'Introduce a new feature' },
  { title: 'fix', value: 'fix', description: 'Fix a bug' },
  { title: 'docs', value: 'docs', description: 'Modify documentation' },
  { title: 'style', value: 'style', description: 'Update code formatting' },
  { title: 'refactor', value: 'refactor', description: 'Refactor code' },
  { title: 'perf', value: 'perf', description: 'Optimize performance' },
  { title: 'test', value: 'test', description: 'Modify test cases' },
  { title: 'build', value: 'build', description: 'Modify build configuration' },
  { title: 'chore', value: 'chore', description: 'Modify build process or auxiliary tools' },
  { title: 'revert', value: 'revert', description: 'Revert a previous commit' },
]

export interface Messages {
  gitNotInstalled: string

  notGitRepo: string
  confirmInitGitRepo: string
  initGitRepoSuccess: string

  noChangesToCommit: string

  currentBranch: string
  detachedHead: string

  stagedChanges: string
  unstagedChanges: string

  hasUnstagedChanges: string
  hasUnstagedChangesButEmptyStage: string
  confirmStageChanges: string
  emptyStage: string

  selectChangesToStage: string

  selectCommitType: string
  selectScope: string
  enterCustomScope: string
  enterDescription: string
  enterDescriptionValidation: string

  commitMessage: string
  commitChanges: string

  confirmCommit: string
}

export const cnMessages: Messages = {
  gitNotInstalled: '未检测到 git，请先安装 git',
  notGitRepo: '当前目录不是 git 仓库，请先初始化 git 仓库',
  confirmInitGitRepo: '是否初始化 git 仓库？',
  initGitRepoSuccess: '初始化 git 仓库成功',
  noChangesToCommit: '没有需要提交的更改',
  currentBranch: '当前分支',
  detachedHead: '游离状态',
  stagedChanges: '暂存的更改',
  unstagedChanges: '未暂存的更改',
  hasUnstagedChanges: '当前有未暂存的更改',
  hasUnstagedChangesButEmptyStage: '暂存区为空，但有未暂存的更改',
  confirmStageChanges: '需要暂存某些文件的更改吗？',
  emptyStage: '暂存区为空，无需提交',
  selectChangesToStage: '请选择需要暂存的更改',
  selectCommitType: '请选择提交类型',
  selectScope: '请选择本次提交的作用域',
  enterCustomScope: '请输入自定义作用域',
  enterDescription: '请输入本次提交的描述',
  enterDescriptionValidation: '描述不能为空',
  commitMessage: '提交信息',
  commitChanges: '提交更改',
  confirmCommit: '确认提交？',
}

export const enMessages: Messages = {
  gitNotInstalled: 'Git is not installed. Please install Git first: https://git-scm.com/downloads',
  notGitRepo: 'The current directory is not a Git repository. Please initialize a Git repository first.',
  confirmInitGitRepo: 'Would you like to initialize a Git repository?',
  initGitRepoSuccess: 'Git repository initialized successfully.',
  noChangesToCommit: 'There are no changes to commit.',
  currentBranch: 'Current branch',
  detachedHead: 'Detached HEAD',
  stagedChanges: 'Staged changes',
  unstagedChanges: 'Unstaged changes',
  hasUnstagedChanges: 'There are some unstaged changes.',
  hasUnstagedChangesButEmptyStage: 'The stage is empty, but there are unstaged changes.',
  confirmStageChanges: 'Would you like to stage some changes?',
  emptyStage: 'The stage is empty, so there is no need to commit.',
  selectChangesToStage: 'Please select the changes you want to stage',
  selectCommitType: 'Please select the commit type',
  selectScope: 'Please select the scope of this commit',
  enterCustomScope: 'Please enter a custom scope',
  enterDescription: 'Please enter the description of this commit',
  enterDescriptionValidation: 'Description cannot be empty',
  commitMessage: 'Commit message',
  commitChanges: 'Commit changes',
  confirmCommit: 'Confirm commit?',
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

export async function getConfig() {
  const customConfig = await _getConfig()
  const config = {
    types: customConfig.types?.length ? customConfig.types : defaultTypes,
    messages: customConfig.language === 'zh' ? cnMessages : enMessages,
    scopes: customConfig.scopes || [],
  }
  return config
}
