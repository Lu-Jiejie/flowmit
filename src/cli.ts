import process from 'node:process'
import { homedir } from 'node:os'
import { handleCommit } from './commit'
import { handleHelp, handleVersion } from './handler'
import { parseArgs } from './parse'

export async function runCli() {
  const parsedArgv = parseArgs(process.argv.slice(2))

  if (parsedArgv.version)
    console.log(handleVersion())

  else if (parsedArgv.help)
    console.log(handleHelp())

  else
    handleCommit()
}

runCli()
