export interface GiscusTheme {
  light: string
  dark: string
}

export type GiscusThemeValue = string | GiscusTheme

export const inPressGiscusTheme = 'inpress'

const giscusThemeTokens = {
  '--color-btn-text': '--vp-c-text-1',
  '--color-btn-bg': '--vp-c-bg-soft',
  '--color-btn-border': '--vp-c-border',
  '--color-btn-hover-bg': '--vp-c-default-soft',
  '--color-btn-hover-border': '--vp-c-default-1',
  '--color-btn-active-bg': '--vp-c-bg-alt',
  '--color-btn-active-border': '--vp-c-default-2',
  '--color-btn-selected-bg': '--vp-c-bg-alt',
  '--color-btn-primary-text': '--vp-button-brand-text',
  '--color-btn-primary-bg': '--vp-button-brand-bg',
  '--color-btn-primary-border': '--vp-button-brand-border',
  '--color-btn-primary-hover-bg': '--vp-button-brand-hover-bg',
  '--color-btn-primary-hover-border': '--vp-button-brand-hover-border',
  '--color-btn-primary-selected-bg': '--vp-button-brand-active-bg',
  '--color-action-list-item-default-hover-bg': '--vp-c-default-soft',
  '--color-segmented-control-bg': '--vp-c-bg-alt',
  '--color-segmented-control-button-bg': '--vp-c-bg',
  '--color-segmented-control-button-selected-border': '--vp-c-default-1',
  '--color-fg-default': '--vp-c-text-1',
  '--color-fg-muted': '--vp-c-text-2',
  '--color-fg-subtle': '--vp-c-text-3',
  '--color-canvas-default': '--vp-c-bg',
  '--color-canvas-overlay': '--vp-c-bg-elv',
  '--color-canvas-inset': '--vp-c-bg-alt',
  '--color-canvas-subtle': '--vp-c-bg-soft',
  '--color-border-default': '--vp-c-border',
  '--color-border-muted': '--vp-c-divider',
  '--color-neutral-muted': '--vp-c-default-soft',
  '--color-accent-fg': '--vp-c-brand-1',
  '--color-accent-emphasis': '--vp-c-brand-2',
  '--color-accent-subtle': '--vp-c-brand-soft',
  '--color-success-fg': '--vp-c-success-1',
  '--color-attention-fg': '--vp-c-warning-1',
  '--color-attention-subtle': '--vp-c-warning-soft',
  '--color-danger-fg': '--vp-c-danger-1',
  '--color-danger-subtle': '--vp-c-danger-soft'
} as const

type ReadCssVariable = (name: string) => string

function mixWithTransparent(color: string, amount: number): string {
  return `color-mix(in srgb, ${color} ${amount}%, transparent)`
}

export function createInPressGiscusTheme(
  isDark: boolean,
  readCssVariable: ReadCssVariable
): string {
  const declarations = Object.entries(giscusThemeTokens).flatMap(
    ([giscusToken, vitePressToken]) => {
      const value = readCssVariable(vitePressToken).trim()
      return value ? [`${giscusToken}:${value}`] : []
    }
  )
  const primaryText = readCssVariable('--vp-button-brand-text').trim()
  const primaryBackground = readCssVariable('--vp-button-brand-bg').trim()
  const accent = readCssVariable('--vp-c-brand-1').trim()
  const accentSoft = readCssVariable('--vp-c-brand-soft').trim()
  const defaultSoft = readCssVariable('--vp-c-default-soft').trim()
  const attention = readCssVariable('--vp-c-warning-1').trim()
  const danger = readCssVariable('--vp-c-danger-1').trim()

  if (primaryText) {
    declarations.push(
      `--color-btn-primary-disabled-text:${mixWithTransparent(primaryText, 50)}`
    )
  }
  if (primaryBackground) {
    declarations.push(
      `--color-btn-primary-disabled-bg:${mixWithTransparent(primaryBackground, 60)}`
    )
  }
  if (accent) {
    declarations.push(
      `--color-accent-muted:${mixWithTransparent(accent, 40)}`
    )
  }
  if (attention) {
    declarations.push(
      `--color-attention-muted:${mixWithTransparent(attention, 40)}`
    )
  }
  if (danger) {
    declarations.push(
      `--color-danger-muted:${mixWithTransparent(danger, 40)}`
    )
  }

  const grayScale = isDark ? '--color-scale-gray-7' : '--color-scale-gray-1'
  const accentScale = isDark ? '--color-scale-blue-8' : '--color-scale-blue-1'
  if (defaultSoft) declarations.push(`${grayScale}:${defaultSoft}`)
  if (accentSoft) declarations.push(`${accentScale}:${accentSoft}`)
  declarations.push(
    `--color-social-reaction-bg-hover:var(${grayScale})`,
    `--color-social-reaction-bg-reacted-hover:var(${accentScale})`
  )

  const baseTheme = isDark ? 'dark' : 'light'
  const css = `@import url('https://giscus.app/themes/${baseTheme}.css');main{${declarations.join(';')}}`

  return `data:text/css;charset=utf-8,${encodeURIComponent(css)}`
}

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
