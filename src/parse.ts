import minimist from 'minimist'

export function parseArgs(argv: string[]) {
  const parsedArgv = minimist(argv, {
    alias: {
      h: 'help',
      H: 'help',
      v: 'version',
      V: 'version',
    },
  })
  return parsedArgv
}
