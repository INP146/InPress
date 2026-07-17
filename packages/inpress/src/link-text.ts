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
  const [owner, repository] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodePathSegment)

  if (!owner) return undefined
  return repository ? `${owner}/${repository}` : owner
}

function getNpmPackageLinkText(url: URL): string | undefined {
  const path = url.pathname.split('/').filter(Boolean).map(decodePathSegment)

  return path[0] === 'package' && path.length > 1
    ? path.slice(1).join('/')
    : undefined
}

const linkTextRules = [
  { prefixes: githubLinkPrefixes, resolve: getRepositoryLinkText },
  { prefixes: gitlabLinkPrefixes, resolve: getRepositoryLinkText },
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
