import pc from 'picocolors'
import { version } from '../package.json'

export function generateVersion() {
  return `v${version}`
}

export function generateHelp() {
  return `
Usage: git-commit [options]
  `
}

export function generateCommitMessage(commitType: string, scope: string, subject: string, body: string): { raw: string, display: string } {
  const commitHeaderRaw = `${commitType}${scope ? `(${scope})` : ''}: ${subject}`
  const commitHeaderDisplay = `${pc.green(commitType)}${scope ? `(${pc.yellow(scope)})` : ''}: ${subject}`

  // Replace all \\n with \n, this caused by prompts text input
  const commitBodyArr = body.split('\\n').map(line => line.trim())
  // Filter out empty lines in the head and tail
  for (let i = 0; i < commitBodyArr.length; i++) {
    if (commitBodyArr[i] !== '') {
      commitBodyArr.splice(0, i)
      break
    }
  }
  for (let i = commitBodyArr.length - 1; i >= 0; i--) {
    if (commitBodyArr[i] !== '') {
      commitBodyArr.splice(i + 1)
      break
    }
  }
  const commitBody = commitBodyArr.join('\n')

  const raw = `${commitHeaderRaw}\n\n${commitBody}`
  const display = `${commitHeaderDisplay}\n\n${commitBody}`
  return { raw, display }
}
