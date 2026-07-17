import type { ThemeColor } from './color'
import type {
  AppearanceTransitionMode,
  InPressThemeConfig,
  ThemePlaygroundConfig
} from './index'
import {
  linkIconProviders,
  type LinkIconProvider
} from './link-icon-providers'

export const defaultThemePlaygroundStorageKey = 'inpress-playground-v4'

export interface ThemePlaygroundState {
  color: string
  linkIcons: boolean
  providers: LinkIconProvider[]
  autoLinkText: boolean
  hideLinkUnderline: boolean
  appearanceTransition: boolean
  appearanceTransitionMode: AppearanceTransitionMode
  giscus: boolean | undefined
}

const HEX_COLOR_RE = /^#(?:[\da-f]{3}|[\da-f]{6})$/i

export function isThemeColor(value: string): value is ThemeColor {
  return HEX_COLOR_RE.test(value)
}

export function resolveThemePlaygroundStorageKey(
  playground: boolean | ThemePlaygroundConfig | undefined
): string | undefined {
  if (!playground) return undefined
  if (playground === true) return defaultThemePlaygroundStorageKey

  return playground.storageKey?.trim() || defaultThemePlaygroundStorageKey
}

export function createThemePlaygroundState(
  theme: InPressThemeConfig
): ThemePlaygroundState {
  return {
    color: theme.color ?? '',
    linkIcons: theme.linkIcons !== false,
    providers: Array.isArray(theme.linkIcons)
      ? [...theme.linkIcons]
      : [...linkIconProviders],
    autoLinkText: theme.autoLinkText !== false,
    hideLinkUnderline: theme.hideLinkUnderline !== false,
    appearanceTransition: theme.appearanceTransition !== false,
    appearanceTransitionMode:
      typeof theme.appearanceTransition === 'string'
        ? theme.appearanceTransition
        : 'spread',
    giscus: undefined
  }
}

export function normalizeThemePlaygroundState(
  value: Partial<ThemePlaygroundState>,
  theme: InPressThemeConfig
): ThemePlaygroundState {
  const fallback = createThemePlaygroundState(theme)
  const providers = Array.isArray(value.providers)
    ? value.providers.filter((provider): provider is LinkIconProvider =>
        linkIconProviders.includes(provider as LinkIconProvider)
      )
    : fallback.providers
  const appearanceTransitionMode =
    value.appearanceTransitionMode === 'fade' ||
    value.appearanceTransitionMode === 'spread'
      ? value.appearanceTransitionMode
      : fallback.appearanceTransitionMode
  const color =
    typeof value.color === 'string' &&
    (value.color.length === 0 || isThemeColor(value.color))
      ? value.color.toLowerCase()
      : fallback.color

  return {
    color,
    linkIcons:
      typeof value.linkIcons === 'boolean'
        ? value.linkIcons
        : fallback.linkIcons,
    providers,
    autoLinkText:
      typeof value.autoLinkText === 'boolean'
        ? value.autoLinkText
        : fallback.autoLinkText,
    hideLinkUnderline:
      typeof value.hideLinkUnderline === 'boolean'
        ? value.hideLinkUnderline
        : fallback.hideLinkUnderline,
    appearanceTransition:
      typeof value.appearanceTransition === 'boolean'
        ? value.appearanceTransition
        : fallback.appearanceTransition,
    appearanceTransitionMode,
    giscus: value.giscus === false ? false : undefined
  }
}

export function createThemePlaygroundOverrides(
  state: ThemePlaygroundState
): Partial<InPressThemeConfig> {
  const color = isThemeColor(state.color)
    ? (state.color.toLowerCase() as ThemeColor)
    : undefined

  const overrides: Partial<InPressThemeConfig> = {
    color,
    linkIcons: state.linkIcons ? [...state.providers] : false,
    autoLinkText: state.autoLinkText,
    hideLinkUnderline: state.hideLinkUnderline,
    appearanceTransition: state.appearanceTransition
      ? state.appearanceTransitionMode
      : false
  }

  if (state.giscus === false) overrides.giscus = false
  return overrides
}
