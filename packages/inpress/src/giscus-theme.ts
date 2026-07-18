export interface GiscusTheme {
  light: string
  dark: string
}

export type GiscusThemeValue = string | GiscusTheme

export function resolveGiscusTheme(
  theme: GiscusThemeValue | undefined,
  isDark: boolean,
  pageUrl?: string
): string {
  const fallback = isDark ? 'dark' : 'light'
  const value =
    typeof theme === 'string'
      ? theme
      : theme
        ? isDark
          ? theme.dark
          : theme.light
        : fallback

  if (value.startsWith('http://')) return fallback

  if (!value.startsWith('/')) return value

  const baseUrl =
    pageUrl ??
    (typeof window === 'undefined' ? undefined : window.location.href)

  if (!baseUrl) return value

  const resolvedUrl = new URL(value, baseUrl)

  return resolvedUrl.protocol === 'https:' ? resolvedUrl.href : fallback
}
