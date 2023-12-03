#!/usr/bin/env node

import { runCli } from './cli'
import { handleError, handleExit } from './utils'

try {
  runCli()
}
catch {
  handleError('程序中断')
  handleExit()
}
