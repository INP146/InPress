import {
  computed,
  defineComponent,
  Fragment,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  watch
} from 'vue'
import { useData, useRoute, withBase, type Theme } from 'vitepress'
import DefaultTheme, {
  type DefaultTheme as VitePressDefaultTheme
} from 'vitepress/theme'
import './style.css'
import { Analytics, type AnalyticsConfig } from './analytics'
import { applyAutoLinkText, observeAutoLinkText } from './auto-link-text'
import { createColorStyle, type ThemeColor } from './color'
import {
  applyFavicon,
  readFaviconTransform,
  resolveFaviconSource,
  type FaviconConfig
} from './favicon'
import { Giscus, type GiscusConfig } from './giscus'
import { applyHomeLogoMonochrome } from './home-logo'
import { createLinkIconStyle } from './link-icons'
import { applyNavLogoMonochrome } from './nav-logo'
import DocMeta from './components/DocMeta.vue'
import type { DocMetaConfig } from './doc-meta'
import {
  linkIconProviders,
  type LinkIconProvider
} from './link-icon-providers'
import { createThemeRuntime, themeRuntimeKey } from './runtime'

export { linkIconProviders } from './link-icon-providers'
export { default as ThemeCheckbox } from './components/ThemeCheckbox.vue'
export { default as ThemeSwitch } from './components/ThemeSwitch.vue'
export type { LinkIconProvider } from './link-icon-providers'
export type { AnalyticsConfig } from './analytics'
export type { FaviconConfig } from './favicon'
export type { ThemeColor } from './color'
export type { GiscusConfig, GiscusMapping, GiscusTheme } from './giscus'
export type { DocMetaConfig, DocMetaPageConfig } from './doc-meta'

export type AppearanceTransitionMode = 'spread' | 'spread-light' | 'fade'

export interface ThemePlaygroundConfig {
  storageKey?: string
}

export interface InPressThemeConfig {
  color?: ThemeColor
  playground?: boolean | ThemePlaygroundConfig
  favicon?: FaviconConfig
  logoMonochrome?: boolean
  homeLogoMonochrome?: boolean
  linkIcons?: boolean | readonly LinkIconProvider[]
  autoLinkText?: boolean
  hideLinkUnderline?: boolean
  appearanceTransition?: boolean | AppearanceTransitionMode
  docMeta?: boolean | DocMetaConfig
  analytics?: AnalyticsConfig | false
  giscus?: GiscusConfig | false
}

declare module 'vitepress' {
  namespace DefaultTheme {
    interface Config extends InPressThemeConfig {}
  }
}

function resolveLinkIcons(
  linkIcons: InPressThemeConfig['linkIcons']
): readonly LinkIconProvider[] {
  if (linkIcons === false) return []
  if (Array.isArray(linkIcons)) return linkIcons
  return linkIconProviders
}

function toggleAppearance(
  isDark: { value: boolean },
  mode: boolean | AppearanceTransitionMode,
  event?: Event
): void {
  const updateAppearance = async () => {
    isDark.value = !isDark.value
    await nextTick()
  }

  const target =
    event?.currentTarget instanceof Element ? event.currentTarget : null
  const flyout = target?.closest<HTMLElement>('.VPFlyout')
  const thumb = target
    ?.closest<HTMLElement>('.VPSwitchAppearance')
    ?.querySelector<HTMLElement>('.check')
  const startsDark = isDark.value
  const initialThumbBounds = thumb?.getBoundingClientRect()
  const initialThumbCenter = initialThumbBounds
    ? {
        x: initialThumbBounds.left + initialThumbBounds.width / 2,
        y: initialThumbBounds.top + initialThumbBounds.height / 2
      }
    : undefined
  const canAnimate =
    mode !== false &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!canAnimate) {
    void updateAppearance()
    return
  }

  const pointerEvent = event instanceof MouseEvent && event.detail > 0
  const fallbackX = pointerEvent ? event.clientX : window.innerWidth / 2
  const fallbackY = pointerEvent ? event.clientY : window.innerHeight / 2
  document.documentElement.classList.add('inpress-appearance-transition-running')
  if (mode === 'spread-light') {
    document.documentElement.classList.add(
      'inpress-appearance-transition-light'
    )
  }
  flyout?.classList.add('inpress-appearance-transition')
  const transition = document.startViewTransition(updateAppearance)
  let appearanceAnimation: Animation | undefined

  void transition.ready.then(() => {
    const anchorsDarkThumb = mode === 'spread-light'
    const anchorThumbStartsAtInitialPosition = anchorsDarkThumb === startsDark
    const anchorThumbBounds = anchorThumbStartsAtInitialPosition
      ? initialThumbBounds
      : thumb?.getBoundingClientRect()
    const x = anchorThumbBounds
      ? anchorThumbBounds.left + anchorThumbBounds.width / 2
      : (initialThumbCenter?.x ?? fallbackX)
    const y = anchorThumbBounds
      ? anchorThumbBounds.top + anchorThumbBounds.height / 2
      : (initialThumbCenter?.y ?? fallbackY)
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
    const revealsAnimatedTheme =
      mode === 'spread-light' ? !isDark.value : isDark.value
    const keyframes =
      mode === 'fade'
        ? { opacity: revealsAnimatedTheme ? [0, 1] : [1, 0] }
        : {
            clipPath: revealsAnimatedTheme
              ? [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${radius}px at ${x}px ${y}px)`
                ]
              : [
                  `circle(${radius}px at ${x}px ${y}px)`,
                  `circle(0px at ${x}px ${y}px)`
                ]
          }

    appearanceAnimation = document.documentElement.animate(
      keyframes,
      {
        duration: 420,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: revealsAnimatedTheme
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)'
      }
    )
  })

  const finishTransition = async () => {
    appearanceAnimation?.cancel()
    document.documentElement.classList.remove(
      'inpress-appearance-transition-running',
      'inpress-appearance-transition-light'
    )
    if (!flyout) return

    flyout.dispatchEvent(
      new MouseEvent(flyout.matches(':hover') ? 'mouseenter' : 'mouseleave')
    )
    await nextTick()
    flyout.classList.remove('inpress-appearance-transition')
  }

  void transition.finished.then(finishTransition, finishTransition)
}

const Layout = defineComponent({
  name: 'InPressLayout',
  setup() {
    const { theme, frontmatter, isDark } = useData<
      VitePressDefaultTheme.Config & InPressThemeConfig
    >()
    const route = useRoute()
    const runtime = createThemeRuntime(computed(() => theme.value))
    const effectiveTheme = runtime.theme
    let autoLinkTextObserver: MutationObserver | undefined
    const themeStyle = computed(() =>
      [
        createColorStyle(effectiveTheme.value.color),
        createLinkIconStyle(resolveLinkIcons(effectiveTheme.value.linkIcons))
      ].join('')
    )

    provide(themeRuntimeKey, runtime)

    onMounted(() => {
      let storage: Storage | undefined

      try {
        storage = window.localStorage
      } catch {
        storage = undefined
      }

      runtime.restorePlayground(storage)
      applyAutoLinkText(
        document,
        effectiveTheme.value.autoLinkText !== false
      )
      autoLinkTextObserver = observeAutoLinkText(
        document.body,
        () => effectiveTheme.value.autoLinkText !== false
      )
    })

    onUnmounted(() => autoLinkTextObserver?.disconnect())

    onUnmounted(() => applyFavicon(undefined))

    provide('toggle-appearance', (event?: Event) =>
      toggleAppearance(
        isDark,
        effectiveTheme.value.appearanceTransition ?? true,
        event
      )
    )

    watch(
      [
        () => route.path,
        () => isDark.value,
        () => theme.value.logo,
        () => effectiveTheme.value.favicon
      ],
      () => {
        if (typeof document === 'undefined') return

        const source = resolveFaviconSource(
          effectiveTheme.value.favicon,
          theme.value.logo,
          isDark.value
        )
        applyFavicon(
          source ? withBase(source) : undefined,
          readFaviconTransform()
        )
      },
      { flush: 'sync', immediate: true }
    )

    watch(
      [() => route.path, () => effectiveTheme.value.autoLinkText],
      () => {
        if (typeof document === 'undefined') return

        void nextTick(() =>
          applyAutoLinkText(
            document,
            effectiveTheme.value.autoLinkText !== false
          )
        )
      },
      { flush: 'post', immediate: true }
    )

    watch(
      [
        () => route.path,
        () => isDark.value,
        () => effectiveTheme.value.logoMonochrome
      ],
      () => {
        if (typeof document === 'undefined') return

        void nextTick(() =>
          applyNavLogoMonochrome(
            effectiveTheme.value.logoMonochrome === true
          )
        )
      },
      { flush: 'post', immediate: true }
    )

    watch(
      [() => route.path, () => effectiveTheme.value.homeLogoMonochrome],
      () => {
        if (typeof document === 'undefined') return

        void nextTick(() =>
          applyHomeLogoMonochrome(
            effectiveTheme.value.homeLogoMonochrome === true
          )
        )
      },
      { flush: 'post', immediate: true }
    )

    return () => {
      return h(Fragment, null, [
        effectiveTheme.value.analytics
          ? h(Analytics, { config: effectiveTheme.value.analytics })
          : null,
        themeStyle.value
          ? h('style', {
              id: 'inpress-overrides',
              innerHTML: themeStyle.value
            })
          : null,
        h(
          DefaultTheme.Layout,
          {
            class: {
              'inpress-hide-link-underline':
                effectiveTheme.value.hideLinkUnderline !== false,
              'inpress-logo-monochrome':
                effectiveTheme.value.logoMonochrome === true,
              'inpress-home-logo-monochrome':
                effectiveTheme.value.homeLogoMonochrome === true
            }
          },
          {
            'doc-top': () => {
              const docMeta = effectiveTheme.value.docMeta

              return docMeta && frontmatter.value.docMeta !== false
                ? h(DocMeta, {
                    config: docMeta === true ? {} : docMeta,
                    key: route.path
                  })
                : null
            },
            'doc-after': () => {
              const giscus = effectiveTheme.value.giscus

              return giscus && frontmatter.value.giscus !== false
                ? h(Giscus, { config: giscus, key: route.path })
                : null
            }
          }
        )
      ])
    }
  }
})

const theme: Theme = {
  extends: DefaultTheme,
  Layout
}

export default theme
