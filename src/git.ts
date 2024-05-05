import { basename, dirname } from 'node:path'
import type { FileInfo } from './types'
import { execCommand } from './utils'

function isUndefined(value: any) {
  return typeof value === 'undefined'
}

export function isGitInstalled() {
  return !isUndefined(execCommand('git --version'))
}

export function isInGitRepository() {
  return !isUndefined(execCommand('git rev-parse --is-inside-work-tree'))
}

export function initGitRepository() {
  return !isUndefined(execCommand('git init -b main'))
}

export function getUntrackedFiles(): FileInfo[] {
  const result = execCommand('git ls-files --others --exclude-standard')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '')
    .map((file) => {
      return { status: 'U', name: basename(file), path: dirname(file) }
    })
}

export function getUnstagedTrackedFiles(): FileInfo[] {
  const result = execCommand('git diff --no-ext-diff --name-status')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '').map((row) => {
    const [status, file] = row.trim().split(/\s+/)
    return { status: status === '??' ? 'U' : status, name: basename(file), path: dirname(file) } as FileInfo
  })
}

export function getStagedFiles(): FileInfo[] {
  const result = execCommand('git diff --no-ext-diff --name-status --cached')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '').map((row) => {
    const [status, file] = row.trim().split(/\s+/)
    return { status: status === '??' ? 'U' : status, name: basename(file), path: dirname(file) } as FileInfo
  })
}

export function getUnstagedFiles(): FileInfo[] {
  return [...getUnstagedTrackedFiles(), ...getUntrackedFiles()]
}

export function getBranchName() {
  const result = execCommand('git branch --show-current')
  if (isUndefined(result))
    return ''
  return result
}

export function stageFiles(files: string[]) {
  const result = execCommand(`git add ${files.join(' ')}`)
  return !isUndefined(result)
}

export function commit(message: string) {
  const result = execCommand(`git commit -m "${message}"`)
  return !isUndefined(result)
}
