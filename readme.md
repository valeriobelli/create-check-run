The goal of this library is to make smooth create and publish annotations in a GitHub Check run by using GitHub Checks API. This is a partial refactor of the exceptional library [create-check](https://github.com/hipstersmoothie/create-check).

## Installation

```bash
npm install --save-dev create-check
```

## Usage

This library offers two usages:
 - CLI
 - Programmatic

### CLI

The usage is straightforward and explained following

```bash
$ create-check-run \
  --annotations '[{"annotation_level":"failure","end_line":10,"message":"Failed test.","path":"/src/__tests__/index.ts","start_line":10}]' \
  --appId 1
  --checkName "GitHub Checker" \
  --checkRunTitle "This is a check that has been run" \
  --installationId 1
  --privateKey "<Private Key>"
```

More information is contained in the CLI help description.

### Programmatic

Just use it as following

```typescript
import { createCheckRun } from '@drugolebowski/create-check-run'

createCheckRun({
  annotations: [
    {
      annotation_level: 'failure',
      end_line: 10,
      message: 'Failed test.',
      path: '/src/__tests__/index.ts',
      start_line: 10,
    },
  ],
  appId: 1,
  checkName: 'GitHub Checker',
  checkRunTitle: 'This is a check that has been run',
  installationId: 1,
  privateKey: '<private key>',
}).catch((err) => console.err(err.message))
```

## Notes

Make attention that this library tries to associate the Check Run to the refs HEAD or HEAD^1. Therefore, you should be sure that these two refs does not refers to the merge commit. No checks will be created in the Pull Request if this would happen.

Both programmatic and CLI usages can initialise the following parameters by using environment variables:
 - `appId` by `APP_ID`
 - `installationId` by `INSTALLATION_ID`
 - `privateKey` by `PRIVATE_KEY`
