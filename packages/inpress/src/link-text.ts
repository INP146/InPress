export const githubLinkPrefixes = [
  'https://github.com/',
  'https://www.github.com/'
] as const

export const gitlabLinkPrefixes = [
  'https://gitlab.com/',
  'https://www.gitlab.com/'
] as const

export const npmLinkPrefixes = [
  'https://npmjs.com/',
  'https://www.npmjs.com/'
] as const

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function getRepositoryLinkText(url: URL): string | undefined {
  const [owner, repository, ...subpage] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodePathSegment)

  if (!owner || !repository || subpage.length > 0) return undefined
  const repositoryName = repository?.replace(/\.git$/i, '')
  return repositoryName ? `${owner}/${repositoryName}` : undefined
}

function getGitLabRepositoryLinkText(url: URL): string | undefined {
  const path = url.pathname.split('/').filter(Boolean).map(decodePathSegment)
  const subpageMarker = path.indexOf('-')
  const repositoryPath =
    subpageMarker >= 0 ? path.slice(0, subpageMarker) : path

  if (!repositoryPath.length) return undefined
  repositoryPath[repositoryPath.length - 1] = repositoryPath.at(-1)!.replace(
    /\.git$/i,
    ''
  )
  return repositoryPath.filter(Boolean).join('/') || undefined
}

function getNpmPackageLinkText(url: URL): string | undefined {
  const path = url.pathname.split('/').filter(Boolean).map(decodePathSegment)

  if (path[0] !== 'package' || !path[1]) return undefined
  if (path[1].startsWith('@')) {
    const encodedScopedPackage = path[1].split('/')
    if (
      encodedScopedPackage.length === 2 &&
      encodedScopedPackage.every(Boolean)
    ) {
      return path[1]
    }
    return path[2] ? `${path[1]}/${path[2]}` : undefined
  }
  return path[1]
}

const linkTextRules = [
  { prefixes: githubLinkPrefixes, resolve: getRepositoryLinkText },
  { prefixes: gitlabLinkPrefixes, resolve: getGitLabRepositoryLinkText },
  { prefixes: npmLinkPrefixes, resolve: getNpmPackageLinkText }
] as const

export function resolveProviderLinkText(href: string): string | undefined {
  let url: URL

  try {
    url = new URL(href)
  } catch {
    return undefined
  }

  const rule = linkTextRules.find(({ prefixes }) =>
    prefixes.some((prefix) => url.href.startsWith(prefix))
  )
  return rule?.resolve(url)
}
