import { Octokit } from '@octokit/rest'
import * as C from 'fp-ts/Console'
import * as f from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as TE from 'fp-ts/TaskEither'
import { Check, PromiseContent } from '~/types'
import { getCommitShaFromRef } from '~/utils/getCommitShaFromRef'

type CreateReturnType = TE.TaskEither<Error, PromiseContent<ReturnType<Octokit['checks']['create']>>>

const errorHandler = (err: unknown) => {
  const error = err instanceof Error ? err : new Error('Unknown error')

  C.log(`Failed to create a check run. Exited with error: ${error.message}`)

  return error
}

const sendCheck =
  ({ checks: { create } }: Octokit) =>
  (check: Check) =>
  (ref: string) =>
    f.pipe(
      getCommitShaFromRef(ref),
      TE.chain((head_sha) => TE.tryCatch(IO.of(create({ ...check, head_sha })), errorHandler))
    )

export const defineCheckRun =
  (octokit: Octokit) =>
  (check: Check): CreateReturnType =>
    f.pipe(sendCheck(octokit)(check)('HEAD'), TE.orElse(IO.of(sendCheck(octokit)(check)('HEAD^1'))))
