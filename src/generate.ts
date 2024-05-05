import pc from 'picocolors'
import { description, version } from '../package.json'
import { getGitVersion } from './git'

export function generateVersion() {
  return `flowmit  ${pc.green(`v${version}`)}
git      ${pc.blue(`v${getGitVersion()}`)}`
}

export function generateHelp() {
  return `${pc.bold(pc.green('flowmit'))} ${pc.green(`v${version}`)}  ${description}

Usage:
  flowmit ${pc.gray('[options]')}

Options:
  -h, --help     display help
  -v, --version  display version
  --dry          only generate the commit message without commit

${pc.yellow('check https://github.com/Lu-Jiejie/flowmit for more information.')}`
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
