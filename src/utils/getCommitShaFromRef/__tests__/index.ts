import execa, { ExecaError } from 'execa'
import * as E from 'fp-ts/Either'
import { mocked } from 'ts-jest/utils'
import { getCommitShaFromRef } from '..'

jest.mock('execa')

afterEach(jest.resetAllMocks)

describe('getCommitShaFromRef', () => {
  it('returns an ExecaError instance if execa fails to get commit sha', async () => {
    const execaError = new Error('Execa error') as ExecaError

    execaError.stderr = ''
    execaError.stdout = ''

    mocked(execa).mockRejectedValue(execaError as any)

    const result = await getCommitShaFromRef('HEAD')()

    expect(result).toStrictEqual(E.left(new Error('Execa error')))
  })

  it('returns a generic Error instance if execa fails to get commit sha with an unknown reason', async () => {
    const execaError = new Error('Execa error')

    mocked(execa).mockRejectedValue(execaError)

    const result = await getCommitShaFromRef('HEAD')()

    expect(result).toStrictEqual(E.left(new Error('Failed to get commit sha related to ref "HEAD"')))
  })

  it('returns as expected the commit sha', async () => {
    mocked(execa).mockResolvedValue({ stdout: 'thisisamockedsha' } as any)

    const result = await getCommitShaFromRef('HEAD')()

    expect(result).toStrictEqual(E.right('thisisamockedsha'))
  })
})
