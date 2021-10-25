import execa, { ExecaError } from 'execa'
import * as f from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as TE from 'fp-ts/TaskEither'

const errorHandler = (ref: string) => (err: unknown) => {
  if (err instanceof Error && 'stdout' in err && 'stderr' in err) {
    return err as ExecaError
  }

  return new Error(`Failed to get commit sha related to ref "${ref}"`)
}

export const getCommitShaFromRef = (ref: string) =>
  f.pipe(
    TE.tryCatch(IO.of(execa('git', ['rev-parse', ref])), errorHandler(ref)),
    TE.map(({ stdout }) => stdout)
  )
