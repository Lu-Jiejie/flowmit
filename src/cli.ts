import process from 'node:process'
import prompts from 'prompts-plus'
import pc from 'picocolors'
import { formatError, formatFileStatus, formatSuccess, formatTitle, formatWarning } from './format'
import { generateHelp, generateVersion } from './generate'
import { parseArgs } from './parse'
import { commit, getBranchName, getStagedFiles, getUnstagedFiles, initGitRepository, isGitInstalled, isInGitRepository, stageFiles } from './git'
import type { FileInfo } from './types'
import { getConfig } from './config'

function exitWithError(message: string) {
  console.log()
  console.log(formatError(message))
  process.exit('0')
}

function exitWithErrorInterrupted() {
  console.log()
  exitWithError('Process interrupted. Exiting...')
}

export async function runCommitCli() {
  const INDENT = '  '
  const EMPTY_SCOPE = '###EMPTY###'
  const CUSTOM_SCOPE = '###CUSTOM###'
  const config = await getConfig()

  // check if git is installed
  if (!isGitInstalled()) {
    console.log(formatWarning(config.messages.gitNotInstalled))
    process.exit(0)
  }

  // check if in git repository
  if (!isInGitRepository()) {
    console.log(formatWarning(config.messages.notGitRepo))
    console.log()
    const { toInit } = await prompts({
      type: 'confirm',
      name: 'toInit',
      message: config.messages.confirmInitGitRepo,
      initial: true,
      onState({ aborted }) {
        aborted && exitWithErrorInterrupted()
      },
    }) as { toInit: boolean }

    !toInit && exitWithError('Refusing to initialize git repository. Exiting...')

    initGitRepository()
    console.log()
    console.log(formatSuccess(config.messages.initGitRepoSuccess))
    console.log()
  }

  const branchName = getBranchName() || config.messages.detachedHead
  const stagedFiles = getStagedFiles()
  const unstagedFiles = getUnstagedFiles()

  if (!unstagedFiles.length && !stagedFiles.length)
    exitWithError(config.messages.noChangesToCommit)

  console.log(formatTitle(config.messages.currentBranch))
  console.log(`${INDENT}${branchName}`)
  console.log()

  if (stagedFiles.length) {
    console.log(formatTitle(config.messages.stagedChanges))
    stagedFiles.forEach((file) => {
      console.log(INDENT + formatFileStatus(file))
    })
    console.log()
  }

  if (unstagedFiles.length) {
    console.log(formatTitle(config.messages.unstagedChanges))
    unstagedFiles.forEach((file) => {
      console.log(INDENT + formatFileStatus(file))
    })
    console.log()
  }

  const toStageFiles: FileInfo[] = []

  if (unstagedFiles.length) {
    if (stagedFiles.length)
      console.log(formatWarning(config.messages.hasUnstagedChanges))
    else
      console.log(formatWarning(config.messages.hasUnstagedChangesButEmptyStage))
    console.log()

    const { toStage } = await prompts({
      type: 'confirm',
      name: 'toStage',
      message: config.messages.confirmStageChanges,
      initial: true,
      onState({ aborted }) {
        aborted && exitWithError('')
      },
    }) as { toStage: boolean }

    console.log()
    if (!toStage && !stagedFiles.length)
      exitWithError(config.messages.emptyStage)

    const { seletedFiles } = toStage
      ? await prompts({
        type: 'multiselect',
        name: 'seletedFiles',
        message: config.messages.selectChangesToStage,
        instructions: false,
        min: 1,
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

  const { commitType } = await prompts({
    type: 'select',
    name: 'commitType',
    message: config.messages.selectCommitType,
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
    message: config.messages.selectScope,
    choices: [
      ...config.scopes.map(scope => ({ title: scope, value: scope })),
      { title: '──────────', heading: true },
      { title: 'empty', value: EMPTY_SCOPE },
      { title: 'custom', value: CUSTOM_SCOPE },
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
      message: config.messages.enterCustomScope,
      initial: '',
      onState({ aborted }) {
        aborted && exitWithErrorInterrupted()
      },
    })
    scope = customScope
    console.log()
  }

  const { description } = await prompts({
    type: 'text',
    name: 'description',
    message: config.messages.enterDescription,
    initial: '',
    validate: (value: string) => value.trim() !== '' || config.messages.enterDescriptionValidation,
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { description: string }
  console.log()

  const commitMessage = `${commitType}${scope ? `(${scope})` : ''}: ${description}`
  const commitFiles = [...stagedFiles, ...toStageFiles]

  console.log(formatTitle(config.messages.commitMessage))
  console.log(pc.dim(commitMessage))
  console.log()
  console.log(formatTitle(config.messages.commitChanges))
  commitFiles.forEach((file) => {
    console.log(formatFileStatus(file))
  })
  console.log()

  const { toCommit } = await prompts({
    type: 'confirm',
    name: 'toCommit',
    message: config.messages.confirmCommit,
    initial: true,
    onState({ aborted }) {
      aborted && exitWithErrorInterrupted()
    },
  }) as { toCommit: boolean }

  !toCommit && exitWithError('Refusing to commit. Exiting...')

  stageFiles(toStageFiles.map(({ name, path }) => `${path}/${name}`)) && commit(commitMessage) ? formatSuccess('提交成功') : formatError('提交失败')
}

export async function runCli() {
  const parsedArgv = parseArgs(process.argv.slice(2))

  if (parsedArgv.version)
    console.log(generateVersion())

  else if (parsedArgv.help)
    console.log(generateHelp())

  else
    runCommitCli()
}

runCli()
