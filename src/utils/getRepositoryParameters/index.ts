import envCi from 'env-ci'

export const getRepositoryParameters = () => {
  const env = envCi()
  const [owner = process.env.OWNER ?? '', repo = process.env.REPO ?? ''] = 'slug' in env ? env.slug.split('/') : []

  return { owner, repo }
}
