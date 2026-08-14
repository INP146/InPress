import type { DefaultTheme } from 'vitepress'

export interface DocMetaConfig {
  author?: string
  homeLabel?: string
  readingSpeed?: number
}

export interface DocMetaPageConfig {
  author?: string
  date?: string | number
  views?: string | number
  wordCount?: number
  readingTime?: number
}

export interface DocMetaBreadcrumb {
  text: string
  link?: string
}

type ResolvedSidebar = {
  base?: string
  items: DefaultTheme.SidebarItem[]
}

function normalizePath(path: string): string {
  const resolved = path
    .split(/[?#]/, 1)[0]
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/')
    .replace(/\/+$/, '')

  return resolved || '/'
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function matchesSidebarPrefix(path: string, prefix: string): boolean {
  const normalizedPrefix = ensureLeadingSlash(prefix).replace(/\/+$/, '') || '/'
  return normalizedPrefix === '/'
    ? path.startsWith('/')
    : path === normalizedPrefix || path.startsWith(`${normalizedPrefix}/`)
}

function resolveSidebarLink(link: string, base?: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(link)) return link
  if (!base) return ensureLeadingSlash(link)
  return `${base.replace(/\/+$/, '')}/${link.replace(/^\/+/, '')}`
}

function resolveSidebar(
  sidebar: DefaultTheme.Sidebar | undefined,
  path: string
): ResolvedSidebar {
  if (Array.isArray(sidebar)) return { items: sidebar }
  if (!sidebar) return { items: [] }

  const normalizedPath = ensureLeadingSlash(path)
  const key = Object.keys(sidebar)
    .sort((left, right) => right.split('/').length - left.split('/').length)
    .find((candidate) => matchesSidebarPrefix(normalizedPath, candidate))
  const resolved = key ? sidebar[key] : undefined

  if (!resolved) return { items: [] }
  return Array.isArray(resolved)
    ? { items: resolved }
    : { base: resolved.base, items: resolved.items }
}

function firstItemLink(
  item: DefaultTheme.SidebarItem,
  inheritedBase?: string
): string | undefined {
  const base = item.base || inheritedBase
  if (item.link) return resolveSidebarLink(item.link, base)

  for (const child of item.items ?? []) {
    const link = firstItemLink(child, base)
    if (link) return link
  }

  return undefined
}

function findBreadcrumbTrail(
  items: DefaultTheme.SidebarItem[],
  path: string,
  inheritedBase?: string
): DocMetaBreadcrumb[] | undefined {
  for (const item of items) {
    const base = item.base || inheritedBase
    const link = item.link ? resolveSidebarLink(item.link, base) : undefined
    const childTrail = item.items
      ? findBreadcrumbTrail(item.items, path, base)
      : undefined
    const matches = link && normalizePath(link) === normalizePath(path)

    if (!matches && !childTrail) continue

    const breadcrumb = item.text
      ? {
          text: item.text,
          link: matches ? undefined : link || firstItemLink(item, base)
        }
      : undefined

    return breadcrumb
      ? [breadcrumb, ...(childTrail ?? [])]
      : (childTrail ?? [])
  }

  return undefined
}

export function resolveDocMetaBreadcrumbs(
  sidebar: DefaultTheme.Sidebar | undefined,
  path: string,
  pageTitle: string
): DocMetaBreadcrumb[] {
  const resolved = resolveSidebar(sidebar, path)
  const trail = findBreadcrumbTrail(resolved.items, path, resolved.base) ?? []

  if (!trail.length) return pageTitle ? [{ text: pageTitle }] : []

  const last = trail.at(-1)
  if (pageTitle && normalizePath(last?.link ?? path) !== normalizePath(path)) {
    trail.push({ text: pageTitle })
  }

  return trail
}

export function countDocWords(text: string): number {
  const cjkCharacters = text.match(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu
  )
  const nonCjkWords = text
    .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ')
    .match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu)

  return (cjkCharacters?.length ?? 0) + (nonCjkWords?.length ?? 0)
}

export function resolveReadingTime(
  wordCount: number,
  readingSpeed = 220
): number {
  if (wordCount <= 0) return 0
  const speed = Number.isFinite(readingSpeed) && readingSpeed > 0
    ? readingSpeed
    : 220
  return Math.max(0.1, Math.round((wordCount / speed) * 10) / 10)
}

type DocMetaDateTimeFormatOptions = NonNullable<
  DefaultTheme.LastUpdatedOptions['formatOptions']
>

const defaultDateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'medium'
} satisfies Intl.DateTimeFormatOptions

export function formatDocMetaDate(
  value: string | number,
  locale = 'en-US',
  formatOptions?: DocMetaDateTimeFormatOptions
): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined
  if (!Number.isFinite(value)) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  const resolvedOptions = formatOptions
    ? { ...formatOptions }
    : { ...defaultDateTimeFormatOptions }
  delete resolvedOptions.forceLocale

  return new Intl.DateTimeFormat(
    locale.trim() || 'en-US',
    resolvedOptions
  ).format(date)
}
