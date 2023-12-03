import { isUndefined } from '@lu-jiejie/utils'
import { execCommand } from './utils'

export function isGitInstalled() {
  return !isUndefined(execCommand('git --version'))
}

export function isInGitRepository() {
  return !isUndefined(execCommand('git rev-parse --is-inside-work-tree'))
}

export function initGitRepository() {
  return !isUndefined(execCommand('git init -b main'))
}

export interface FileInfo {
  file: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'

export function getUntrackedFiles(): FileInfo[] {
  const result = execCommand('git ls-files --others --exclude-standard')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '').map(file => ({ file, status: 'U' }))
}

export function getUnstagedTrackedFiles(): FileInfo[] {
  const result = execCommand('git diff --no-ext-diff --name-status')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '').map((row) => {
    const [status, file] = row.trim().split(/\s+/)
    return { status: status === '??' ? 'U' : status, file } as FileInfo
  })
}

export function getStagedFiles(): FileInfo[] {
  const result = execCommand('git diff --no-ext-diff --name-status --cached')
  if (isUndefined(result))
    return []
  return result.split('\n').filter(row => row.trim() !== '').map((row) => {
    const [status, file] = row.trim().split(/\s+/)
    return { status: status === '??' ? 'U' : status, file } as FileInfo
  })
}

export function getUnstagedFiles(): FileInfo[] {
  return [...getUnstagedTrackedFiles(), ...getUntrackedFiles()]
}

export function getFilesInfo(): FileInfo[] {
  const result = execCommand('git status --porcelain')
  if (isUndefined(result))
    return []
  return result.split('\n').map((row) => {
    const [status, file] = row.trim().split(/\s+/)
    return { status: status === '??' ? 'U' : status, file } as FileInfo
  })
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
