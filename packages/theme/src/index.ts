import { Fragment, h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeBadge from './components/ThemeBadge.vue'

export { ThemeBadge }

export type ThemeCssVars = Record<`--${string}`, string | number>

export interface ThemeOptions {
  cssVars?: {
    root?: ThemeCssVars
    dark?: ThemeCssVars
  }
}

function createTokenStyle(cssVars: ThemeOptions['cssVars']): string {
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

export function createTheme(options: ThemeOptions = {}): Theme {
  const tokenStyle = createTokenStyle(options.cssVars)

  return {
    extends: DefaultTheme,
    Layout: () =>
      h(Fragment, null, [
        tokenStyle
          ? h('style', { id: 'vitepress-theme-tokens' }, tokenStyle)
          : null,
        h(DefaultTheme.Layout)
      ]),
    enhanceApp({ app }) {
      app.component('ThemeBadge', ThemeBadge)
    }
  }
}

export default createTheme()
