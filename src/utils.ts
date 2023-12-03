import { execSync } from 'node:child_process'
import { exit } from 'node:process'
import pc from 'picocolors'
import type { FileStatus } from './git'

export function execCommand(command: string) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
  }
  catch {
    return undefined
  }
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
