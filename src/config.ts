import process from 'node:process'
import pc from 'picocolors'
import { findUpInGitRootDir, tryRequire } from './utils'

export interface Options {
  /** commit types */
  types: {
    /** commit types title that would be shown */
    title: string
    /** commit types value that would be used in commit message */
    value: string
    /** commit types description that would be shown */
    description: string
  }[]
  /** the scopes of the commit */
  scopes: string[]
  /** only generate the commit message without commit */
  dry: boolean
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

export interface PromptsText {
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

export const promptsText: PromptsText = {
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

export function defineConfig(config: Partial<Options>) {
  return config
}

export async function _getConfig(): Promise<Partial<Options>> {
  const configPath = await findUpInGitRootDir(['flowmit.config.ts', 'flowmit.config.js'])
  if (!configPath)
    return {}
  const cwdConfig = (await tryRequire(configPath, process.cwd())) as Partial<Options>
  return cwdConfig
}

export async function getConfig() {
  const customConfig = await _getConfig()
  const config = {
    types: customConfig.types?.length ? customConfig.types : defaultTypes,
    messages: promptsText,
    scopes: customConfig.scopes || [],
    dry: customConfig.dry || false,
  }
  return config
}
