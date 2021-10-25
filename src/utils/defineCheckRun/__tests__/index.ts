import { Octokit } from '@octokit/rest'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import { mocked } from 'ts-jest/utils'
import { getCommitShaFromRef } from '~/utils/getCommitShaFromRef'
import { defineCheckRun } from '..'

jest.mock('~/utils/getCommitShaFromRef')

afterEach(jest.resetAllMocks)

describe('defineCheckRun', () => {
  it('fails to create a check run if it fails to get commit sha for ref "HEAD"', async () => {
    mocked(getCommitShaFromRef).mockReturnValue(T.of(E.left(new Error('This is an error'))))

    const create = jest.fn()

    const result = await defineCheckRun({ checks: { create } } as unknown as Octokit)({})()

    expect(result).toMatchObject(E.left(new Error('This is an error')))
    expect(create).not.toHaveBeenCalled()
  })

  it('fails to create a check run if it fails to send the check run', async () => {
    mocked(getCommitShaFromRef).mockReturnValue(T.of(E.right('sha')))

    const create = jest.fn(() => Promise.reject(new Error('Failed to create the check run!')))

    const result = await defineCheckRun({ checks: { create } } as unknown as Octokit)({})()

    expect(result).toMatchObject(E.left(new Error('Failed to create the check run!')))
    expect(create).toHaveBeenCalledTimes(2)
    expect(create).toHaveBeenCalledWith({ head_sha: 'sha' })
  })

  it('fails to create a check run if it fails to send the check run after fallbacking to ref "HEAD^1"', async () => {
    mocked(getCommitShaFromRef).mockReturnValueOnce(T.of(E.left(new Error('Failed!'))))
    mocked(getCommitShaFromRef).mockReturnValueOnce(T.of(E.right('thisisasha')))

    const create = jest.fn(() => Promise.reject(new Error('Failed to create the check run!')))

    const result = await defineCheckRun({ checks: { create } } as unknown as Octokit)({})()

    expect(result).toMatchObject(E.left(new Error('Failed to create the check run!')))
    expect(create).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledWith({ head_sha: 'thisisasha' })
  })

  it('creates a check run for ref "HEAD"', async () => {
    mocked(getCommitShaFromRef).mockReturnValue(T.of(E.right('sha')))

    const create = jest.fn(() => Promise.resolve('Created!'))

    const result = await defineCheckRun({ checks: { create } } as unknown as Octokit)({})()

    expect(result).toMatchObject(E.right('Created!'))
    expect(create).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledWith({ head_sha: 'sha' })
  })

  it('creates a check run after fallbacking to ref "HEAD^1"', async () => {
    mocked(getCommitShaFromRef).mockReturnValueOnce(T.of(E.left(new Error('Failed to get sha for "HEAD"'))))
    mocked(getCommitShaFromRef).mockReturnValueOnce(T.of(E.right('sha')))

    const create = jest.fn(() => Promise.resolve('Created!'))

    const result = await defineCheckRun({ checks: { create } } as unknown as Octokit)({})()

    expect(result).toMatchObject(E.right('Created!'))
    expect(create).toHaveBeenCalledTimes(1)
    expect(create).toHaveBeenCalledWith({ head_sha: 'sha' })
  })
})
