import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

type Param = {
  appId: number
  installationId: number
  privateKey: string
}

export const instantiateOctokit = ({ appId, installationId, privateKey }: Param) =>
  new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey,
    },
  })
