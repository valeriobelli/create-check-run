import { Annotation } from '~/types'
import { instantiateOctokit } from '~/utils/instantiateOctokit'
import createCheckRun from '..'

describe('createCheckRun', () => {
  it('creates a check run', async () => {
    const appId = Number(process.env.APP_ID!)
    const installationId = Number(process.env.INSTALLATION_ID!)
    const privateKey = process.env.PRIVATE_KEY!
    const octokit = instantiateOctokit({
      appId,
      installationId,
      privateKey,
    })
    const annotations: Annotation[] = []

    const checkRunId = await createCheckRun({
      annotations,
      appId,
      checkRunName: "I'm checking if everything is correctly set up",
      installationId,
      title: 'Smoke test',
      privateKey,
    })

    const checkRunGot = await octokit.checks.get({
      repo: 'create-check-run',
      owner: 'DrugoLeB',
      check_run_id: checkRunId,
    })

    expect(checkRunId).toBeGreaterThan(0)
    expect(checkRunGot.data.pull_requests[0]).not.toBeUndefined()
  })
})
