import { BaseReporter, Context } from '@jest/reporters'
import { AggregatedResult } from '@jest/test-result'
import path from 'path'
import createCheckRun, { Annotation } from '../../lib'

export default class CustomReporter extends BaseReporter {
  // eslint-disable-next-line class-methods-use-this
  async onRunComplete(context?: Set<Context>, result?: AggregatedResult) {
    if (!result || !context) {
      return
    }

    const annotations = result.testResults
      .flatMap(({ testResults, testFilePath }) => {
        return testResults.map(({ failureMessages, status, location }): Annotation | null => {
          if (!location) {
            return null
          }

          if (status !== 'failed') {
            return null
          }

          console.log(testFilePath, process.cwd(), path.relative(process.cwd(), testFilePath))

          return {
            annotation_level: 'failure',
            end_line: location.line,
            message: failureMessages.join('\n'),
            path: path.relative(process.cwd(), testFilePath),
            start_line: location.line,
          }
        })
      })
      .filter((annotation): annotation is Annotation => Boolean(annotation))

    if (annotations.length > 0) {
      await createCheckRun({ annotations, checkName: 'Jest Reporter', checkRunTitle: `Found errored tests.` })
    }
  }
}
