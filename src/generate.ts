import { version } from '../package.json'

export function generateVersion() {
  return `v${version}`
}

export function generateHelp() {
  return `
Usage: git-commit [options]
  `
}
