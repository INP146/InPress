import { defineComponent, Fragment, h, nextTick, watch } from 'vue'
import { useData, useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeBadge from './components/ThemeBadge.vue'
import {
  createLinkIconStyle,
  linkIconProviders,
  resolveProviderLinkText,
  type LinkIconProvider
} from './link-icons'

export { ThemeBadge }
export { linkIconProviders, resolveProviderLinkText } from './link-icons'
export type { LinkIconProvider } from './link-icons'

export type ThemeCssVars = Record<`--${string}`, string | number>

export interface Inp146ThemeSettings {
  cssVars?: {
    root?: ThemeCssVars
    dark?: ThemeCssVars
  }
  linkIcons?: boolean | readonly LinkIconProvider[]
  autoLinkText?: boolean
  hideLinkUnderline?: boolean
}

export interface Inp146ThemeConfig {
  inp146?: Inp146ThemeSettings
}

function createTokenStyle(
  cssVars: Inp146ThemeSettings['cssVars']
): string {
  const rules = [
    [':root', cssVars?.root],
    [':root.dark', cssVars?.dark]
  ] as const

  return rules
    .filter(([, values]) => values && Object.keys(values).length > 0)
    .map(([selector, values]) => {
      const declarations = Object.entries(values!)
        .map(([name, value]) => `${name}: ${value};`)
        .join('')

      return `${selector} {${declarations}}`
    })
    .join('')
}

function resolveLinkIcons(
  linkIcons: Inp146ThemeSettings['linkIcons']
): readonly LinkIconProvider[] {
  if (linkIcons === false) return []
  if (Array.isArray(linkIcons)) return linkIcons
  return linkIconProviders
}

function createLinkUnderlineStyle(hideLinkUnderline = true): string {
  return hideLinkUnderline
    ? '.vp-doc a,.vp-doc a:hover{text-decoration:none;}'
    : ''
}

function hasUrlLinkText(link: HTMLAnchorElement): boolean {
  if (link.childElementCount > 0) return false

  const text = link.textContent?.trim()
  if (!text) return false

  try {
    return new URL(text, document.baseURI).href === link.href
  } catch {
    return false
  }
}

function applyAutoLinkText(enabled: boolean): void {
  document.querySelectorAll<HTMLAnchorElement>('.vp-doc a[href]').forEach((link) => {
    const originalText = link.dataset.inp146AutoLinkText

    if (!enabled) {
      if (originalText !== undefined) {
        link.textContent = originalText
        delete link.dataset.inp146AutoLinkText
      }
      return
    }

    if (originalText !== undefined || !hasUrlLinkText(link)) return

    const label = resolveProviderLinkText(link.href)
    if (!label) return

    link.dataset.inp146AutoLinkText = link.textContent ?? ''
    link.textContent = label
  })
}

export function createTheme(): Theme {
  const Layout = defineComponent({
    name: 'VitePressThemeLayout',
    setup() {
      const { theme } = useData<Inp146ThemeConfig>()
      const route = useRoute()

      watch(
        [() => route.path, () => theme.value.inp146?.autoLinkText],
        () => {
          if (typeof document === 'undefined') return

          void nextTick(() =>
            applyAutoLinkText(theme.value.inp146?.autoLinkText !== false)
          )
        },
        { flush: 'post', immediate: true }
      )

      return () => {
        const settings = theme.value.inp146
        const themeStyle = [
          createTokenStyle(settings?.cssVars),
          createLinkIconStyle(resolveLinkIcons(settings?.linkIcons)),
          createLinkUnderlineStyle(settings?.hideLinkUnderline)
        ].join('')

        return h(Fragment, null, [
          themeStyle
            ? h('style', {
                id: 'vitepress-theme-overrides',
                innerHTML: themeStyle
              })
            : null,
          h(DefaultTheme.Layout)
        ])
      }
    }
  })

  return {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
      app.component('ThemeBadge', ThemeBadge)
    }
  }
}

export default createTheme()
