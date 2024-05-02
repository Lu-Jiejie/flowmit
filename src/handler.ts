import { exit } from 'node:process'
import pc from 'picocolors'
import { version } from '../package.json'
import type { FileStatus } from './types'

export function handleVersion() {
  return `v${version}`
}

export function handleHelp() {
  return `
Usage: git-commit [options]
  `
}

export function handleExit(code: number = 0) {
  exit(code)
}

export function handleWarn(message: string) {
  console.log(pc.yellow(message))
}

export function handleError(message: string) {
  console.log(pc.red(message))
}

export function handleMessage(message: string) {
  console.log(pc.dim(message))
}

export function handleSuccess(message: string) {
  console.log(pc.green(message))
}

export function formatStatus(status: FileStatus) {
  switch (status) {
    case 'A':
      return pc.green(status)
    case 'U':
      return pc.green(status)
    case 'M':
      return pc.yellow(status)
    case 'D':
      return pc.red(status)
    default:
      return pc.yellow(status)
  }
}
