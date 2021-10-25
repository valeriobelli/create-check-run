import envCi from 'env-ci'
import * as C from 'fp-ts/Console'
import * as E from 'fp-ts/Either'
import { Annotation, Check } from './types'
import { chunk } from './utils/chunk'
import { deepMerge } from './utils/deepMerge'
import { defineCheckRun } from './utils/defineCheckRun'
import { getAuthenticatedApp } from './utils/getAuthenticatedApp'
import { getRepositoryParameters } from './utils/getRepositoryParameters'
import { instantiateOctokit } from './utils/instantiateOctokit'

type CheckOptions = {
  /** The annotations to be posted to the GitHub check */
  annotations: Array<Annotation>
  /** The number or errors generated during the run */
  errorCount: number
  /** The number or warnings generated during the run */
  warningCount?: number
  /** The GitHub app id to create the check with */
  appId: number
  /** The GitHub app repo installation id */
  installationId: number
  /** The GitHub private key to create the check with */
  privateKey: string
  /** The name of the tool thats running */
  checkTitle: string
  /** The title of the check mark */
  name: string
}

export default async function createCheckRun({
  annotations,
  appId,
  checkTitle,
  errorCount,
  installationId,
  name,
  privateKey,
  warningCount = 0,
}: CheckOptions) {
  if (!envCi().isCi) {
    return -1
  }

  const octokit = instantiateOctokit({ appId, installationId, privateKey })
  const result = await getAuthenticatedApp(octokit)()

  if (E.isLeft(result)) {
    C.log('Error when tried to authenticate the app')

    throw result.left
  }

  const summary =
    (errorCount > 0 && 'Your project seems to have some errors.') ||
    (warningCount > 0 && 'Your project seems to have some warnings.') ||
    'Your project correctly passed the needed checks!'

  const [firstAnnotationsBatch, ...annotationsBatches] = chunk(annotations, 50)

  const { owner, repo } = getRepositoryParameters()

  const templateCheck: Check = {
    owner,
    repo,
    output: {
      title: checkTitle,
      summary,
    },
  }

  const completed_at = new Date().toISOString()
  const conclusion = errorCount > 0 ? 'failure' : 'success'
  const check: Check = deepMerge(templateCheck, {
    name,
    completed_at,
    conclusion,
    output: {
      annotations: firstAnnotationsBatch,
    },
  })

  const createCheckResult = await defineCheckRun(octokit)(check)()

  if (E.isLeft(createCheckResult)) {
    throw createCheckResult.left
  }

  const {
    data: { id: check_run_id },
  } = createCheckResult.right

  const updateRuns = annotationsBatches.map((annotationsBatch) =>
    octokit.checks.update(
      deepMerge(templateCheck, {
        check_run_id,
        output: {
          annotations: annotationsBatch,
        },
      })
    )
  )

  await Promise.all(updateRuns)

  return check_run_id
}

export type { Annotation }
