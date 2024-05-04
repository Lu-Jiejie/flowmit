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

export interface I18N {
  Message_GitNotInstalled: string

  Message_NotGitRepo: string
  Prompts_ConfirmInitGitRepo: string
  Message_InitGitRepoSuccess: string

  Message_NoChangesToCommit: string

  Title_CurrentBranch: string

  Title_StagedChanges: string
  Title_UnstagedChanges: string

  Message_HasUnstagedChanges: string
  Message_HasUnstagedChangesButEmptyStage: string
  Prompts_ConfirmStageChanges: string
  Message_EmptyStage: string

  Prompts_SelectChangesToStage: string

  Prompts_SelectCommitType: string
  Prompts_SelectScope: string
  Prompts_EnterCustomScope: string
  Prompts_EnterDescription: string
  Validation_EnterDescription: string

  Title_CommitMessage: string
  Title_CommitChanges: string

  Prompts_ConfirmCommit: string
}

export const ZH: I18N = {
  Message_GitNotInstalled: '未检测到 git，请先安装 git',
  Message_NotGitRepo: '当前目录不是 git 仓库，请先初始化 git 仓库',
  Prompts_ConfirmInitGitRepo: '是否初始化 git 仓库？',
  Message_InitGitRepoSuccess: '初始化 git 仓库成功',
  Message_NoChangesToCommit: '没有需要提交的更改',
  Title_CurrentBranch: '当前分支',
  Title_StagedChanges: '暂存的更改',
  Title_UnstagedChanges: '未暂存的更改',
  Message_HasUnstagedChanges: '当前有未暂存的更改',
  Message_HasUnstagedChangesButEmptyStage: '暂存区为空，但有未暂存的更改',
  Prompts_ConfirmStageChanges: '需要暂存某些文件的更改吗？',
  Message_EmptyStage: '暂存区为空，无需提交',
  Prompts_SelectChangesToStage: '请选择需要暂存的更改',
  Prompts_SelectCommitType: '请选择提交类型',
  Prompts_SelectScope: '请选择本次提交的作用域',
  Prompts_EnterCustomScope: '请输入自定义作用域',
  Prompts_EnterDescription: '请输入本次提交的描述',
  Validation_EnterDescription: '描述不能为空',
  Title_CommitMessage: '提交信息',
  Title_CommitChanges: '提交更改',
  Prompts_ConfirmCommit: '确认提交？',
}

export const EN: I18N = {
  Message_GitNotInstalled: 'Git is not installed. Please install Git first: https://git-scm.com/downloads',
  Message_NotGitRepo: 'The current directory is not a Git repository. Please initialize a Git repository first.',
  Prompts_ConfirmInitGitRepo: 'Would you like to initialize a Git repository?',
  Message_InitGitRepoSuccess: 'Git repository initialized successfully.',
  Message_NoChangesToCommit: 'There are no changes to commit.',
  Title_CurrentBranch: 'Current branch',
  Title_StagedChanges: 'Staged changes',
  Title_UnstagedChanges: 'Unstaged changes',
  Message_HasUnstagedChanges: 'There are some unstaged changes.',
  Message_HasUnstagedChangesButEmptyStage: 'The stage is empty, but there are unstaged changes.',
  Prompts_ConfirmStageChanges: 'Would you like to stage some changes?',
  Message_EmptyStage: 'The stage is empty, so there is no need to commit.',
  Prompts_SelectChangesToStage: 'Please select the changes you want to stage',
  Prompts_SelectCommitType: 'Please select the commit type',
  Prompts_SelectScope: 'Please select the scope of this commit',
  Prompts_EnterCustomScope: 'Please enter a custom scope',
  Prompts_EnterDescription: 'Please enter the description of this commit',
  Validation_EnterDescription: 'Description cannot be empty',
  Title_CommitMessage: 'Commit message',
  Title_CommitChanges: 'Commit changes',
  Prompts_ConfirmCommit: 'Confirm commit?',
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
    messages: customConfig.language === 'zh' ? ZH : EN,
    scopes: customConfig.scopes || [],
  }
  return config
}
