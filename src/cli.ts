import Command, { flags } from '@oclif/command'
import { CLIError } from '@oclif/errors'
import createCheckRun from '.'

export class CreateCheckRun extends Command {
  async run() {
    try {
      const { flags: inputFlags } = this.parse(CreateCheckRun)

      await createCheckRun(inputFlags as Parameters<typeof createCheckRun>[0])
    } catch (err) {
      const error = err instanceof Error ? err : new CLIError('Unknown error. 🤷')

      throw new CLIError(error)
    }
  }
}

CreateCheckRun.description = `Utility that aims to help you for creating Checks on GitHub by using GitHub Check API`

CreateCheckRun.flags = {
  annotations: flags.string({
    description:
      'The annotations to add on the GitHub check. Adds information from your analysis to specific lines of code. Annotations are visible on GitHub in the Checks and Files changed tab of the pull request.',
    parse: JSON.parse,
    required: true,
  }),
  appId: flags.integer({
    description: 'The Gi  tHub app id to use for creating the check',
    env: 'APP_ID',
    required: true,
  }),
  checkName: flags.string({
    description: 'The name of the check. For example, "GitHub Jest reporter".',
    required: true,
  }),
  checkRunTitle: flags.string({
    description: 'The title of the check run.',
    required: true,
  }),
  installationId: flags.integer({
    description: 'The GitHub app repo installation id',
    env: 'INSTALLATION_ID',
    required: true,
  }),
  privateKey: flags.string({
    description: 'The GitHub private key for authenticating the requests',
    env: 'PRIVATE_KEY',
    required: true,
  }),
}

CreateCheckRun.strict = true

CreateCheckRun.usage = '--annotations=<annotations> --checkName=<checkName> --checkRunTitle=<checkRunTitle>'
