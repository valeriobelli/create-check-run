import envCi from 'env-ci'
import { mocked } from 'ts-jest/utils'
import { getRepositoryParameters } from '..'

jest.mock('env-ci')

const originalProcessEnv = process.env

const injectProcessEnv = (env: NodeJS.Process['env']) =>
  Object.defineProperty(process, 'env', { writable: true, value: env })

afterEach(jest.resetAllMocks)

afterAll(() => {
  process.env = originalProcessEnv
})

describe('getRepositoryParameters', () => {
  it('returns repo and owner got by "env-ci"', () => {
    mocked(envCi).mockReturnValue({ slug: 'Bar/Foo' } as envCi.CiEnv)

    const { owner, repo } = getRepositoryParameters()

    expect(owner).toBe('Bar')
    expect(repo).toBe('Foo')
  })

  it('returns repo and owner got by process.env', () => {
    injectProcessEnv({ OWNER: 'Foo', REPO: 'Bar' })

    mocked(envCi).mockReturnValue({} as envCi.CiEnv)

    const { owner, repo } = getRepositoryParameters()

    expect(owner).toBe('Foo')
    expect(repo).toBe('Bar')
  })

  it('returns repo and owner got by process.env', () => {
    injectProcessEnv({})
    mocked(envCi).mockReturnValue({} as envCi.CiEnv)

    const { owner, repo } = getRepositoryParameters()

    expect(owner).toBe('')
    expect(repo).toBe('')
  })
})
