import { Octokit } from '@octokit/rest'
import { identity } from 'fp-ts/lib/function'
import { tryCatch } from 'fp-ts/lib/TaskEither'

export const getAuthenticatedApp = (octokit: Octokit) => tryCatch(octokit.apps.getAuthenticated, identity)
