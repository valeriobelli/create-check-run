import envCi from 'env-ci'
import * as C from 'fp-ts/Console'
import * as E from 'fp-ts/Either'
import { annotationsBatchSize } from './constants'
import { Annotation, Check } from './types'
import { deepMerge } from './utils/deepMerge'
import { defineCheckRun } from './utils/defineCheckRun'
import { getAuthenticatedApp } from './utils/getAuthenticatedApp'
import { getRepositoryParameters } from './utils/getRepositoryParameters'
import { instantiateOctokit } from './utils/instantiateOctokit'
import { updateCheckRun } from './utils/updateCheckRun'

type CheckOptions = {
  /** The annotations to add on the GitHub check run */
  annotations: Array<Annotation>
  /** The title of the Check Run that is shown on checks section */
  checkRunName: string
  /** The GitHub app id to use for creating the check run */
  appId?: number
  /** The GitHub app repo installation id */
  installationId?: number
  /** The GitHub private key for authenticating the requests */
  privateKey?: string
  /** The title of the Check Run that is shown on checks section */
  title: string
}

export default async function createCheckRun({
  annotations,
  appId = Number(process.env.APP_ID!),
  checkRunName,
  installationId = Number(process.env.INSTALLATION_ID!),
  privateKey = process.env.PRIVATE_KEY!,
  title,
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

  const errorCount = annotations.filter(({ annotation_level }) => annotation_level === 'failure').length
  const warningCount = annotations.filter(({ annotation_level }) => annotation_level === 'warning').length

  const summary =
    (errorCount > 0 && 'The current Pull Request contains some errors.') ||
    (warningCount > 0 && 'The current Pull Request contains some warnings.') ||
    'The current Pull Request correctly passed the checks!'

  const annotationsBatch = annotations.slice(0, annotationsBatchSize)

  const { owner, repo } = getRepositoryParameters()

  const templateCheck: Check = {
    owner,
    repo,
    output: {
      title,
      summary,
    },
  }

  const completed_at = new Date().toISOString()
  const conclusion = errorCount > 0 ? 'failure' : 'success'
  const check: Check = deepMerge(templateCheck, {
    name: checkRunName,
    completed_at,
    conclusion,
    output: {
      annotations: annotationsBatch,
    },
  })

  const createCheckResult = await defineCheckRun(octokit)(check)()

  if (E.isLeft(createCheckResult)) {
    throw createCheckResult.left
  }

  const { id: check_run_id } = createCheckResult.right.data

  await updateCheckRun({
    annotations: annotations.slice(annotationsBatchSize),
    checkRunId: check_run_id,
    octokit,
    templateCheck,
  })

  return check_run_id
}

export type { Annotation }
