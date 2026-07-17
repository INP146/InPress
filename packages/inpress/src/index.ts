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
import { useData, useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { Analytics, type AnalyticsConfig } from './analytics'
import { applyAutoLinkText, observeAutoLinkText } from './auto-link-text'
import { createColorStyle, type ThemeColor } from './color'
import { Giscus, type GiscusConfig } from './giscus'
import { applyHomeLogoMonochrome } from './home-logo'
import { createLinkIconStyle } from './link-icons'
import { applyNavLogoMonochrome } from './nav-logo'
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
export type { ThemeColor } from './color'
export type { GiscusConfig, GiscusMapping, GiscusTheme } from './giscus'

export type AppearanceTransitionMode = 'spread' | 'fade'

export interface ThemePlaygroundConfig {
  storageKey?: string
}

export interface InPressThemeConfig {
  color?: ThemeColor
  playground?: boolean | ThemePlaygroundConfig
  logoMonochrome?: boolean
  homeLogoMonochrome?: boolean
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
