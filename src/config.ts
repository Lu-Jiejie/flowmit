import path from 'node:path'
import process from 'node:process'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import pc from 'picocolors'

export interface Config {
  /** commit types */
  types?: {
    /** commit types title that would be shown */
    title: string
    /** commit types value that would be used in commit message */
    value: string
    /** commit types description that would be shown */
    description: string
  }[]
  /** the scopes of the commit */
  scopes?: string[]
  /** i18n messages */
  language?: 'en' | 'zh'
  /** only copy the commit message to clipboard, instead of commit */
  dry?: boolean
}

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
  Prompts_EnterSubject: string
  Validation_EnterSubject: string
  Prompts_EnterBody: string

  Title_CommitMessage: string
  Title_CommitChanges: string

  Prompts_ConfirmCommit: string
  Message_CommitSuccess: string
  Message_CommitFailed: string

  Message_DryRunStart: string
  Message_DryRunEnd: string
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
  Prompts_EnterCustomScope: '请输入本次提交的作用域',
  Prompts_EnterSubject: `请输入${pc.underline('简短')}的描述作为提交标题`,
  Prompts_EnterBody: `请输入${pc.underline('详细')}的描述作为提交正文${pc.yellow('（可选）')}。使用 "\\n" 换行`,
  Validation_EnterSubject: '提交标题不能为空',
  Title_CommitMessage: '提交信息',
  Title_CommitChanges: '提交更改',
  Prompts_ConfirmCommit: '确认提交？',
  Message_CommitSuccess: '提交成功',
  Message_CommitFailed: '提交失败',
  Message_DryRunStart: 'Dry run. 仅生成提交信息，不执行 git commit',
  Message_DryRunEnd: '提交信息已生成',
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
  Prompts_EnterSubject: `Please enter a ${pc.underline('SHORT')} description as the commit subject`,
  Validation_EnterSubject: 'The commit subject cannot be empty',
  Prompts_EnterBody: `Please enter a ${pc.underline('DETAILED')} description as the commit body ${pc.yellow('(optional)')}. Use "\\n" to separate lines.`,
  Title_CommitMessage: 'Commit message',
  Title_CommitChanges: 'Commit changes',
  Prompts_ConfirmCommit: 'Are you sure you want to commit with the above message?',
  Message_CommitSuccess: 'Commit successful',
  Message_CommitFailed: 'Commit failed',
  Message_DryRunStart: 'Dry run. Only generate commit message instead of git commit.',
  Message_DryRunEnd: 'The commit message has been generated.',
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
    dry: customConfig.dry || false,
  }
  return config
}
