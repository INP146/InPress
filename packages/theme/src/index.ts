import { defineComponent, Fragment, h } from 'vue'
import { useData, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeBadge from './components/ThemeBadge.vue'
import {
  createLinkIconStyle,
  linkIconProviders,
  type LinkIconProvider
} from './link-icons'

export { ThemeBadge }
export { linkIconProviders } from './link-icons'
export type { LinkIconProvider } from './link-icons'

export type ThemeCssVars = Record<`--${string}`, string | number>

export interface Inp146ThemeSettings {
  cssVars?: {
    root?: ThemeCssVars
    dark?: ThemeCssVars
  }
  linkIcons?: boolean | readonly LinkIconProvider[]
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

export function createTheme(): Theme {
  const Layout = defineComponent({
    name: 'VitePressThemeLayout',
    setup() {
      const { theme } = useData<Inp146ThemeConfig>()

      return () => {
        const settings = theme.value.inp146
        const themeStyle = [
          createTokenStyle(settings?.cssVars),
          createLinkIconStyle(resolveLinkIcons(settings?.linkIcons))
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
