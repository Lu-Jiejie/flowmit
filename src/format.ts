import type { FileInfo } from './types'
import pc from 'picocolors'

export function formatWarning(text: string) {
  return `${pc.inverse(pc.yellow(' WARNING '))} ${pc.yellow(text)}`
}

export function formatError(text: string) {
  return `${pc.inverse(pc.red(' ERROR '))} ${pc.red(text)}`
}

export function formatMessage(text: string) {
  return pc.dim(text)
}

export function formatSuccess(text: string) {
  return `${pc.inverse(pc.green(' SUCCESS '))} ${pc.green(text)}`
}

export function formatTitle(text: string) {
  return pc.blue(`# ${pc.underline(text)}`)
}

export function formatFileStatus(file: FileInfo) {
  const { name, path, status } = file
  let statusStr = ''
  const formatPath = path === '.' ? '' : `${path}/`
  let namePath = `${pc.gray(formatPath)}${name}`
  switch (status) {
    case 'A':
      statusStr = pc.green(status)
      break
    case 'U':
      statusStr = pc.green(status)
      break
    case 'M':
      statusStr = pc.yellow(status)
      break
    case 'D':
      statusStr = pc.red(status)
      namePath = pc.strikethrough(namePath)
      break
    default:
      statusStr = pc.yellow(status)
  }
  return `${statusStr}  ${namePath}`
}
