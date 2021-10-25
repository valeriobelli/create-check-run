import { Octokit } from '@octokit/rest'
import * as A from 'fp-ts/Array'
import * as C from 'fp-ts/Console'
import * as f from 'fp-ts/function'
import { annotationsBatchSize } from '~/constants'
import { Annotation, Check } from '~/types'
import { deepMerge } from '~/utils/deepMerge'
import { chunk } from '../chunk'

type Config = {
  annotations: Array<Annotation>
  checkRunId: number
  octokit: Octokit
  templateCheck: Check
}

export const updateCheckRun = async ({
  annotations,
  checkRunId,
  octokit: {
    checks: { update },
  },
  templateCheck,
}: Config) => {
  if (annotations.length === 0) {
    return Promise.resolve()
  }

  const updateRuns = f.pipe(
    chunk(annotations, annotationsBatchSize),
    A.mapWithIndex((index, annotationsBatch) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const check = deepMerge(templateCheck, {
            check_run_id: checkRunId,
            output: {
              annotations: annotationsBatch,
            },
          })

          update(check).catch(C.log).then(resolve)
        }, index * 100)
      })
    })
  )

  return Promise.all(updateRuns)
}
