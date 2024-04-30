/* eslint-disable no-console */
import { describe, expect, it } from 'vitest'
import { execCommand } from '../src/utils'

describe('execCommand', () => {
  it('should return the git version when the command is "git --version"', async () => {
    const result = execCommand('git --version')
    console.log(result)
    expect(result).toContain('git version')
  })

  it('should return an empty string when the command fails', async () => {
    const result = execCommand('haha --version')
    console.log(result)
    expect(result).toBeUndefined()
  })
})
