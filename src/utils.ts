import { execSync } from 'node:child_process'

export function execCommand(command: string) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
  }
  catch {
    return undefined
  }
}
