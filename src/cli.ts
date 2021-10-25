import Command, { flags } from '@oclif/command'
import createCheckRun from '.'

export class CreateCheckRun extends Command {
  async run() {
    const { flags: inputFlags } = this.parse(CreateCheckRun)

    await createCheckRun(inputFlags as Parameters<typeof createCheckRun>[0])
  }
}

CreateCheckRun.description = ``

CreateCheckRun.strict = true

CreateCheckRun.flags = {
  annotations: flags.string({
    description: 'The annotation to be posted to the GitHub check',
    parse: JSON.parse,
    required: true,
  }),
  errorCount: flags.integer({ description: 'The number or errors generated during the run', required: true }),
  warningCount: flags.integer({ description: 'The number or warnings generated during the run' }),
  appId: flags.integer({ description: 'The GitHub app id to create the check with', env: 'APP_ID', required: true }),
  installationId: flags.integer({
    description: 'The GitHub app repo installation id',
    env: 'INSTALLATION_ID',
    required: true,
  }),
  privateKey: flags.string({
    description: 'The GitHub private key to create the check with',
    env: 'PRIVATE_KEY',
    required: true,
  }),
  checkTitle: flags.string({ description: 'The name of the tool thats running', required: true }),
  name: flags.string({ description: 'The title of the check mark', required: true }),
}
