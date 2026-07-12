import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeBadge from './components/ThemeBadge.vue'
import ThemeLayout from './ThemeLayout.vue'
import './style.css'

export { ThemeBadge }

export type ThemeCssVars = Record<`--${string}`, string | number>

export interface ThemeOptions {
  cssVars?: {
    root?: ThemeCssVars
    dark?: ThemeCssVars
  }
}

export function createTheme(options: ThemeOptions = {}): Theme {
  return {
    extends: DefaultTheme,
    Layout: () => h(ThemeLayout, { cssVars: options.cssVars }),
    enhanceApp({ app }) {
      app.component('ThemeBadge', ThemeBadge)
    }
  }
}

export default createTheme()
