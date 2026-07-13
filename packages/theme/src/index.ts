import { defineComponent, Fragment, h, nextTick, provide, watch } from 'vue'
import { useData, useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { Giscus, type GiscusConfig } from './giscus'
import {
  createLinkIconStyle,
  linkIconProviders,
  resolveProviderLinkText,
  type LinkIconProvider
} from './link-icons'

export { linkIconProviders } from './link-icons'
export type { LinkIconProvider } from './link-icons'
export type { GiscusConfig, GiscusMapping, GiscusTheme } from './giscus'

export type ThemeCssVars = Record<`--${string}`, string | number>

export interface Inp146ThemeConfig {
  cssVars?: {
    root?: ThemeCssVars
    dark?: ThemeCssVars
  }
  linkIcons?: boolean | readonly LinkIconProvider[]
  autoLinkText?: boolean
  hideLinkUnderline?: boolean
  appearanceTransition?: boolean
  giscus?: GiscusConfig | false
}

declare module 'vitepress' {
  namespace DefaultTheme {
    interface Config extends Inp146ThemeConfig {}
  }
}

function createTokenStyle(cssVars: Inp146ThemeConfig['cssVars']): string {
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
  linkIcons: Inp146ThemeConfig['linkIcons']
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

function toggleAppearance(
  isDark: { value: boolean },
  enabled: boolean,
  event?: Event
): void {
  const updateAppearance = async () => {
    isDark.value = !isDark.value
    await nextTick()
  }

  const canAnimate =
    enabled &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!canAnimate) {
    void updateAppearance()
    return
  }

  const pointerEvent = event instanceof MouseEvent && event.detail > 0
  const x = pointerEvent ? event.clientX : window.innerWidth / 2
  const y = pointerEvent ? event.clientY : window.innerHeight / 2
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  const transition = document.startViewTransition(updateAppearance)
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`
  ]

  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath : [...clipPath].reverse() },
      {
        duration: 420,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: isDark.value
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)'
      }
    )
  })
}

export function createTheme(): Theme {
  const Layout = defineComponent({
    name: 'VitePressThemeLayout',
    setup() {
      const { theme, frontmatter, isDark } = useData<Inp146ThemeConfig>()
      const route = useRoute()

      provide('toggle-appearance', (event?: Event) =>
        toggleAppearance(isDark, theme.value.appearanceTransition !== false, event)
      )

      watch(
        [() => route.path, () => theme.value.autoLinkText],
        () => {
          if (typeof document === 'undefined') return

          void nextTick(() =>
            applyAutoLinkText(theme.value.autoLinkText !== false)
          )
        },
        { flush: 'post', immediate: true }
      )

      return () => {
        const themeStyle = [
          createTokenStyle(theme.value.cssVars),
          createLinkIconStyle(resolveLinkIcons(theme.value.linkIcons)),
          createLinkUnderlineStyle(theme.value.hideLinkUnderline)
        ].join('')

        return h(Fragment, null, [
          themeStyle
            ? h('style', {
                id: 'vitepress-theme-overrides',
                innerHTML: themeStyle
              })
            : null,
          h(DefaultTheme.Layout, null, {
            'doc-after': () => {
              const giscus = theme.value.giscus

              return giscus && frontmatter.value.giscus !== false
                ? h(Giscus, { config: giscus, key: route.path })
                : null
            }
          })
        ])
      }
    }
  })

  return {
    extends: DefaultTheme,
    Layout
  }
}

export default createTheme()
