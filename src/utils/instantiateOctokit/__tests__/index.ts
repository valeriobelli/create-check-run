import { Octokit } from '@octokit/rest'
import { instantiateOctokit } from '..'

describe('instantiateOctokit', () => {
  it('instantiates and returns Octokit instance', () => {
    const octokit = instantiateOctokit({ appId: 1, installationId: 1, privateKey: 'key' })

    expect(octokit).toBeInstanceOf(Octokit)
  })
})
