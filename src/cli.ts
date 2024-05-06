import process from 'node:process'
import prompts from 'prompts-plus'
import { formatError, formatFileStatus, formatSuccess, formatTitle, formatWarning } from './format'
import { generateCommitMessage, generateHelp, generateVersion } from './generate'
import { parseArgs } from './parse'
import { commit, getBranchName, getStagedFiles, getUnstagedFiles, initGitRepository, isGitInstalled, isInGitRepository, stageFiles } from './git'
import type { FileInfo, UnPromisify } from './types'
import { getConfig } from './config'

const CUSTOM_SCOPE = '###CUSTOM###'
const COMMIT_MESSAGE_SPLITTER = '###──────────────────────────────────────────###'

function exitWithError(message: string) {
  console.log()
  console.log(formatError(message))
  process.exit('0')
}

function exitWithErrorInterrupted() {
  console.log()
  exitWithError('Process interrupted. Exiting...')
}

async function checkGit_Cli(config: UnPromisify<typeof getConfig>) {
  // check if git is installed
  if (!isGitInstalled()) {
    console.log(formatWarning(config.messages.Message_GitNotInstalled))
    process.exit(0)
  }

  // check if in git repository
  if (!isInGitRepository()) {
    console.log(formatWarning(config.messages.Message_NotGitRepo))
    console.log()
    const { toInit } = await prompts({
      type: 'toggle',
      name: 'toInit',
      active: 'yes',
      inactive: 'no',
      message: config.messages.Prompts_ConfirmInitGitRepo,
      initial: true,
      onState({ aborted }) {
        aborted && exitWithErrorInterrupted()
      },
    }) as { toInit: boolean }

    !toInit && exitWithError('Refusing to initialize git repository. Exiting...')

    initGitRepository()
    console.log()
    console.log(formatSuccess(config.messages.Message_InitGitRepoSuccess))
    console.log()
  }
}

async function stageChanges_Cli(config: UnPromisify<typeof getConfig>) {
  const branchName = getBranchName() || 'Detached HEAD'
  const stagedFiles = getStagedFiles()
  const unstagedFiles = getUnstagedFiles()

  if (!unstagedFiles.length && !stagedFiles.length)
    exitWithError(config.messages.Message_NoChangesToCommit)

  console.log(formatTitle(config.messages.Title_CurrentBranch))
  console.log(`${branchName}`)
  console.log()

  if (stagedFiles.length) {
    console.log(formatTitle(config.messages.Title_StagedChanges))
    stagedFiles.forEach((file) => {
      console.log(formatFileStatus(file))
    })
    console.log()
  }

  if (unstagedFiles.length) {
    console.log(formatTitle(config.messages.Title_UnstagedChanges))
    unstagedFiles.forEach((file) => {
      console.log(formatFileStatus(file))
    })
    console.log()
  }

  const toStageFiles: FileInfo[] = []

  if (unstagedFiles.length) {
    if (stagedFiles.length)
      console.log(formatWarning(config.messages.Message_HasUnstagedChanges))
    else
      console.log(formatWarning(config.messages.Message_HasUnstagedChangesButEmptyStage))
    console.log()

    const { toStage } = await prompts({
      type: 'toggle',
      name: 'toStage',
      active: 'yes',
      inactive: 'no',
      message: config.messages.Prompts_ConfirmStageChanges,
      initial: true,
      onState({ aborted }) {
        aborted && exitWithError('')
      },
    }) as { toStage: boolean }
    console.log()

    if (!toStage && !stagedFiles.length)
      exitWithError(config.messages.Message_EmptyStage)

    const { seletedFiles } = toStage
      ? await prompts({
        type: 'multiselect',
        name: 'seletedFiles',
        hint: 'a to toggle all, ←/→/space to select, ↓/↑ to navigate',
        message: config.messages.Prompts_SelectChangesToStage,
        min: 1,
        instructions: false,
        choices: unstagedFiles.map(file => ({
          title: formatFileStatus(file),
          value: file,
          selected: true,
        })),
        onState({ aborted }) {
          aborted && exitWithErrorInterrupted()
        },
      })
      : { seletedFiles: [] }
    console.log()
    toStageFiles.push(...seletedFiles)
  }
  return {
    stagedFiles,
    toStageFiles,
  }
}

async function generateCommitMessage_Cli(config: UnPromisify<typeof getConfig>) {
  const { commitType } = await prompts({
    type: 'select',
    name: 'commitType',
    message: config.messages.Prompts_SelectCommitType,
    instructions: false,
    choices: config.types,
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  })
  console.log()

  let { scope } = await prompts({
    type: 'select',
    name: 'scope',
    message: config.messages.Prompts_SelectScope,
    choices: [
      ...config.scopes.map(scope => ({ title: scope, value: scope })),
      ...(config.scopes.length
        ? [
            { title: '──────────', heading: true },
            { title: 'empty', value: '' },
            { title: 'custom', value: CUSTOM_SCOPE },
          ]
        : [
            { title: 'empty', value: '' },
            { title: 'custom', value: CUSTOM_SCOPE },
          ]),

    ],
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { scope: string }
  console.log()

  if (scope === CUSTOM_SCOPE) {
    const { customScope } = await prompts({
      type: 'text',
      name: 'customScope',
      message: config.messages.Prompts_EnterCustomScope,
      initial: '',
      onState({ aborted }) {
        aborted && exitWithErrorInterrupted()
      },
    })
    scope = customScope
    console.log()
  }

  const { subject } = await prompts({
    type: 'text',
    name: 'subject',
    message: `${config.messages.Prompts_EnterSubject}\n`,
    initial: '',
    validate: (value: string) => value.trim() !== '' || config.messages.Validation_EnterSubject,
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { subject: string }
  console.log()

  const { body } = await prompts({
    type: 'text',
    name: 'body',
    message: `${config.messages.Prompts_EnterBody}\n`,
    initial: '',
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { body: string }
  console.log()

  const commitMessage = generateCommitMessage(commitType, scope, subject, body)

  return commitMessage
}

function displayCommitMessage(config: UnPromisify<typeof getConfig>, commitMessage: ReturnType<typeof generateCommitMessage>,
) {
  console.log(formatTitle(config.messages.Title_CommitMessage))
  console.log(COMMIT_MESSAGE_SPLITTER)
  console.log(commitMessage.display)
  console.log(COMMIT_MESSAGE_SPLITTER)
  console.log()
}

function displayCommitChanges(config: UnPromisify<typeof getConfig>, stagedFiles: FileInfo[], toStageFiles: FileInfo[]) {
  console.log(formatTitle(config.messages.Title_CommitChanges))
  ;[...stagedFiles, ...toStageFiles].forEach((file) => {
    console.log(formatFileStatus(file))
  })
  console.log()
}

async function commit_Cli(config: UnPromisify<typeof getConfig>, toStageFiles: FileInfo[], commitMessage: ReturnType<typeof generateCommitMessage>) {
  const { toCommit } = await prompts({
    type: 'toggle',
    name: 'toCommit',
    active: 'yes',
    inactive: 'no',
    message: config.messages.Prompts_ConfirmCommit,
    initial: true,
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { toCommit: boolean }

  !toCommit && exitWithError('Refusing to commit. Exiting...')

  stageFiles(toStageFiles.map(({ name, path }) => `${path}/${name}`))
  if (commit(commitMessage.raw))
    console.log(formatSuccess(config.messages.Message_CommitSuccess))
  else
    console.log(formatError(config.messages.Message_CommitFailed))
}

export async function runCommitCli(config: UnPromisify<typeof getConfig>) {
  // dry run
  if (config.dry) {
    console.log(formatWarning(config.messages.Message_DryRunStart))
    console.log()
    const commitMessage = await generateCommitMessage_Cli(config)
    displayCommitMessage(config, commitMessage)
    console.log(formatSuccess(config.messages.Message_DryRunEnd))
    return
  }

  await checkGit_Cli(config)

  const { stagedFiles, toStageFiles } = await stageChanges_Cli(config)

  const commitMessage = await generateCommitMessage_Cli(config)

  displayCommitMessage(config, commitMessage)

  displayCommitChanges(config, stagedFiles, toStageFiles)

  await commit_Cli(config, toStageFiles, commitMessage)
}

export async function runCli() {
  const parsedArgv = parseArgs(process.argv.slice(2))
  if (parsedArgv.version) {
    console.log(generateVersion())
  }
  else if (parsedArgv.help) {
    console.log(generateHelp())
  }
  else {
    const config = await getConfig()
    config.dry = parsedArgv.dry || config.dry
    runCommitCli(config)
  }
}

runCli()
