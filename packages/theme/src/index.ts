import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeBadge from './components/ThemeBadge.vue'
import './style.css'

export { ThemeBadge }

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ThemeBadge', ThemeBadge)
  }
} satisfies Theme
