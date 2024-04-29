import { handleCommit } from './commit'
import { handleError, handleExit } from './utils'

try {
  handleCommit()
}
catch {
  handleError('程序中断')
  handleExit()
}
