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
    const annotations: Annotation[] = [
      { annotation_level: 'failure', message: 'This is a message', start_line: 9, end_line: 10, path: 'src/index.ts' },
    ]

    const checkRunId = await createCheckRun({
      annotations,
      appId,
      checkTitle: 'This is a title',
      errorCount: 1,
      installationId,
      name: 'Name',
      privateKey,
    })

    const checkRunGot = await octokit.checks.get({
      repo: 'create-check-run',
      owner: 'DrugoLeB',
      check_run_id: checkRunId,
    })

    expect(checkRunGot).not.toBeInstanceOf(Error)
  })
})
