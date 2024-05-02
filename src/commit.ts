import prompts from 'prompts'
import pc from 'picocolors'
import { commit, getBranchName, getStagedFiles, getUnstagedFiles, initGitRepository, isGitInstalled, isInGitRepository, stageFiles } from './git'
import { formatStatus, handleError, handleExit, handleSuccess, handleWarn } from './handler'
import type { FileInfo } from './types'

export async function handleCommit() {
  // 检查 Git 是否安装
  if (!isGitInstalled()) {
    handleWarn('Git 未安装，请先安装 Git 后再试')
    handleExit()
  }

  // 检查是否在 Git 仓库中
  if (!isInGitRepository()) {
    handleWarn('当前目录不在 Git 仓库中，是否要在当前目录初始化 Git 仓库？/n')
    const { toInit } = await prompts({
      type: 'confirm',
      name: 'toInit',
      message: '是否要在当前目录初始化 Git 仓库？',
      initial: true,
      onState({ aborted }) {
        if (aborted) {
          handleError('\n程序中断')
          handleExit()
        }
      },
    }) as { toInit: boolean }

    !toInit && handleExit()

    initGitRepository()
    handleSuccess('\n初始化 Git 仓库成功\n')
  }

  const branchName = getBranchName()
  const stagedFiles = getStagedFiles()
  const unstagedFiles = getUnstagedFiles()

  if (!unstagedFiles.length && !stagedFiles.length) {
    handleError('当前没有需要提交的文件')
    handleExit()
  }

  console.log(pc.bold(pc.bgCyan('当前分支')))
  console.log(`${pc.dim(branchName === '' ? '游离状态' : branchName)}\n`)

  if (stagedFiles.length) {
    console.log(pc.bold(pc.bgCyan('暂存的更改')))
    stagedFiles.forEach(({ file, status }) => {
      console.log(`${pc.bold(formatStatus(status))} ${pc.dim(file)}`)
    })
    console.log()
  }

  if (unstagedFiles.length) {
    console.log(pc.bold(pc.bgCyan('更改')))
    unstagedFiles.forEach(({ file, status }) => {
      console.log(`${pc.bold(formatStatus(status))} ${pc.dim(file)}`)
    })
    console.log()
  }

  const toStageFiles: FileInfo[] = []

  if (unstagedFiles.length) {
    if (stagedFiles.length)
      handleWarn('当前有尚未暂存的更改\n')
    else
      handleWarn('暂存区为空，但检测到有尚未暂存的更改\n')

    const { toStage } = await prompts({
      type: 'confirm',
      name: 'toStage',
      message: '需要暂存某些文件的更改吗？',
      initial: true,
      onState({ aborted }) {
        if (aborted) {
          handleError('\n程序中断')
          handleExit()
        }
      },
    }) as { toStage: boolean }

    console.log()
    if (!toStage && !stagedFiles.length) {
      handleError('暂存区为空，暂无文件可提交')
      handleExit()
    }

    const { seletedFiles } = toStage
      ? await prompts({
        type: 'multiselect',
        name: 'seletedFiles',
        message: `请选择需要暂存的文件`,
        instructions: false,
        // hint: `使用${pc.underline(' Space键 ')}切换选中状态，` + `使用${pc.underline(' A键 ')}切换全选状态，` + `使用${pc.underline(' Enter键 ')}确认`,
        min: 1,
        choices: unstagedFiles.map(({ file, status }) => ({
          title: `${formatStatus(status)} ${file}`,
          value: { file, status },
          selected: true,
        })),
        onState({ aborted }) {
          if (aborted) {
            handleError('\n程序中断')
            handleExit()
          }
        },
      })
      : { seletedFiles: [] }
    console.log()

    toStageFiles.push(...seletedFiles)
  }

  const { commitType } = await prompts({
    type: 'select',
    name: 'commitType',
    message: '请选择提交类型',
    instructions: false,
    limit: 11,
    choices: [
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
    onState({ aborted }) {
      if (aborted) {
        handleError('\n程序中断')
        handleExit()
      }
    },
  })
  console.log()

  const { toFillScope } = await prompts({
    type: 'confirm',
    name: 'toFillScope',
    message: '是否需要填写本次提交的作用域？',
    initial: false,
    onState({ aborted }) {
      if (aborted) {
        handleError('\n程序中断')
        handleExit()
      }
    },
  }) as { toFillScope: boolean }
  toFillScope && console.log()

  const { scope } = toFillScope
    ? await prompts({
      type: 'text',
      name: 'scope',
      message: '请输入本次提交的作用域',
      initial: '',
      onState({ aborted }) {
        if (aborted) {
          handleError('\n程序中断')
          handleExit()
        }
      },
    }) as { scope: string }
    : { scope: '' }

  console.log()
  const { description } = await prompts({
    type: 'text',
    name: 'description',
    message: '请输入本次提交的描述',
    initial: '',
    validate: (value: string) => value.trim() !== '' || '描述不能为空',
    onState({ aborted }) {
      if (aborted) {
        handleError('\n程序中断')
        handleExit()
      }
    },
  }) as { description: string }
  console.log()

  const commitMessage = `${commitType}${scope ? `(${scope})` : ''}: ${description}`
  const commitFiles = [...stagedFiles, ...toStageFiles]

  console.log(pc.bold(pc.bgCyan('提交信息')))
  console.log(pc.dim(commitMessage))
  console.log()
  console.log(pc.bold(pc.bgCyan('提交文件')))
  commitFiles.forEach(({ file, status }) => {
    console.log(`${pc.bold(formatStatus(status))} ${pc.dim(file)}`)
  })
  console.log()

  const { toCommit } = await prompts({
    type: 'confirm',
    name: 'toCommit',
    message: '是否确认提交？',
    initial: true,
    onState({ aborted }) {
      if (aborted) {
        handleError('\n程序中断')
        handleExit()
      }
    },
  }) as { toCommit: boolean }

  if (!toCommit)
    handleExit()

  stageFiles(toStageFiles.map(({ file }) => file)) && commit(commitMessage) ? handleSuccess('提交成功') : handleError('提交失败')
}
