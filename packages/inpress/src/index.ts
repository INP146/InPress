import {
  computed,
  defineComponent,
  Fragment,
  h,
  nextTick,
  onMounted,
  provide,
  watch
} from 'vue'
import { useData, useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { Analytics, type AnalyticsConfig } from './analytics'
import { createColorStyle, type ThemeColor } from './color'
import { Giscus, type GiscusConfig } from './giscus'
import {
  createLinkIconStyle,
  resolveProviderLinkText
} from './link-icons'
import {
  linkIconProviders,
  type LinkIconProvider
} from './link-icon-providers'
import { createThemeRuntime, themeRuntimeKey } from './runtime'

export { linkIconProviders } from './link-icon-providers'
export type { LinkIconProvider } from './link-icon-providers'
export type { AnalyticsConfig } from './analytics'
export type { ThemeColor } from './color'
export type { GiscusConfig, GiscusMapping, GiscusTheme } from './giscus'

export type AppearanceTransitionMode = 'spread' | 'fade'

export interface ThemePlaygroundConfig {
  storageKey?: string
}

export interface InPressThemeConfig {
  color?: ThemeColor
  playground?: boolean | ThemePlaygroundConfig
  linkIcons?: boolean | readonly LinkIconProvider[]
  autoLinkText?: boolean
  hideLinkUnderline?: boolean
  appearanceTransition?: boolean | AppearanceTransitionMode
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
    const originalText = link.dataset.inpressAutoLinkText

    if (!enabled) {
      if (originalText !== undefined) {
        link.textContent = originalText
        delete link.dataset.inpressAutoLinkText
      }
      return
    }

    if (originalText !== undefined || !hasUrlLinkText(link)) return

    const label = resolveProviderLinkText(link.href)
    if (!label) return

    link.dataset.inpressAutoLinkText = link.textContent ?? ''
    link.textContent = label
  })
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
  flyout?.classList.add('inpress-appearance-transition')
  const transition = document.startViewTransition(updateAppearance)
  let appearanceAnimation: Animation | undefined

  void transition.ready.then(() => {
    const lightThumbBounds = startsDark
      ? thumb?.getBoundingClientRect()
      : undefined
    const x = lightThumbBounds
      ? lightThumbBounds.left + lightThumbBounds.width / 2
      : (initialThumbCenter?.x ?? fallbackX)
    const y = lightThumbBounds
      ? lightThumbBounds.top + lightThumbBounds.height / 2
      : (initialThumbCenter?.y ?? fallbackY)
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
    const revealsDark = isDark.value
    const keyframes =
      mode === 'fade'
        ? { opacity: revealsDark ? [0, 1] : [1, 0] }
        : {
            clipPath: revealsDark
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
        pseudoElement: revealsDark
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)'
      }
    )
  })

  const finishTransition = async () => {
    appearanceAnimation?.cancel()
    document.documentElement.classList.remove(
      'inpress-appearance-transition-running'
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
    const { theme, frontmatter, isDark } = useData<InPressThemeConfig>()
    const route = useRoute()
    const runtime = createThemeRuntime(computed(() => theme.value))
    const effectiveTheme = runtime.theme
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
    })

    provide('toggle-appearance', (event?: Event) =>
      toggleAppearance(
        isDark,
        effectiveTheme.value.appearanceTransition ?? true,
        event
      )
    )

    watch(
      [() => route.path, () => effectiveTheme.value.autoLinkText],
      () => {
        if (typeof document === 'undefined') return

        void nextTick(() =>
          applyAutoLinkText(effectiveTheme.value.autoLinkText !== false)
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
            class:
              effectiveTheme.value.hideLinkUnderline === false
                ? undefined
                : 'inpress-hide-link-underline'
          },
          {
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
