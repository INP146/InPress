import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType
} from 'vue'
import { useData } from 'vitepress'
import {
  createAdaptiveGiscusTheme,
  createInPressGiscusThemes,
  inPressGiscusBaseThemes,
  inPressGiscusTheme,
  inPressGiscusCssVariables,
  requiresExplicitWebKitGiscusTheme,
  resolveGiscusTheme,
  resolveGiscusThemeStylesheet,
  type GiscusThemeValue,
  type InPressGiscusThemes
} from './giscus-theme'

export type { GiscusTheme } from './giscus-theme'

interface GiscusAppearanceController {
  apply: (isDark: boolean) => void
}

const appearanceControllers = new Set<GiscusAppearanceController>()

export function syncGiscusAppearance(isDark: boolean): void {
  for (const controller of appearanceControllers) controller.apply(isDark)
}

export type GiscusMapping =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'

export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping?: GiscusMapping
  term?: string
  strict?: boolean
  reactionsEnabled?: boolean
  emitMetadata?: boolean
  inputPosition?: 'top' | 'bottom'
  theme?: GiscusThemeValue
  lang?: string
  loading?: 'lazy'
}

export const Giscus = defineComponent({
  name: 'Giscus',
  props: {
    config: {
      type: Object as PropType<GiscusConfig>,
      required: true
    }
  },
  setup(props) {
    const { isDark, lang } = useData()
    const container = ref<HTMLDivElement>()
    const followsPageAppearance =
      props.config.theme === undefined ||
      props.config.theme === inPressGiscusTheme ||
      typeof props.config.theme === 'object'
    const usesExplicitWebKitTheme =
      followsPageAppearance &&
      typeof navigator !== 'undefined' &&
      requiresExplicitWebKitGiscusTheme(navigator.userAgent)
    let themeObserver: MutationObserver | undefined
    let updateFrame: number | undefined
    let inPressThemes: InPressGiscusThemes | undefined
    let requestedDark = isDark.value
    let sentTheme: string | undefined
    let pendingTheme: string | undefined
    const preloadLinks: HTMLLinkElement[] = []

    function captureCssVariables(targetDark: boolean): Map<string, string> {
      const root = document.documentElement
      root.classList.toggle('dark', targetDark)
      const styles = getComputedStyle(root)
      const values = new Map<string, string>()

      for (const name of inPressGiscusCssVariables) {
        values.set(name, styles.getPropertyValue(name).trim())
      }

      return values
    }

    function createCurrentInPressThemes(): InPressGiscusThemes {
      if (inPressThemes) return inPressThemes

      const root = document.documentElement
      const startsDark = root.classList.contains('dark')
      let light = new Map<string, string>()
      let dark = new Map<string, string>()

      try {
        light = captureCssVariables(false)
        dark = captureCssVariables(true)
      } finally {
        root.classList.toggle('dark', startsDark)
      }

      const read = (values: Map<string, string>, name: string) => {
        const value = values.get(name) ?? ''
        return value && CSS.supports('color', value) ? value : ''
      }

      inPressThemes = createInPressGiscusThemes(
        (name) => read(light, name),
        (name) => read(dark, name)
      )

      return inPressThemes
    }

    function currentTheme(targetDark = requestedDark): string {
      if (props.config.theme === inPressGiscusTheme) {
        const themes = createCurrentInPressThemes()
        if (!usesExplicitWebKitTheme) return themes.adaptive
        return targetDark ? themes.dark : themes.light
      }

      if (usesExplicitWebKitTheme) {
        return resolveGiscusTheme(props.config.theme, targetDark)
      }

      return createAdaptiveGiscusTheme(props.config.theme)
    }

    function frame(): HTMLIFrameElement | undefined {
      return (
        container.value?.querySelector<HTMLIFrameElement>(
          'iframe.giscus-frame'
        ) ?? undefined
      )
    }

    function sendTheme(theme: string): boolean {
      const target = frame()
      const targetWindow = target?.contentWindow
      if (
        !target ||
        !targetWindow ||
        target.classList.contains('giscus-frame--loading')
      ) {
        pendingTheme = theme
        return false
      }

      targetWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme
            }
          }
        },
        'https://giscus.app'
      )
      sentTheme = theme
      pendingTheme = undefined
      return true
    }

    function updateTheme(refreshInPressTheme = false): void {
      if (refreshInPressTheme) inPressThemes = undefined

      const theme = currentTheme()
      if (theme === sentTheme || theme === pendingTheme) return
      sendTheme(theme)
    }

    function flushPendingTheme(): void {
      if (pendingTheme) sendTheme(pendingTheme)
    }

    function handleGiscusMessage(event: MessageEvent): void {
      if (event.origin !== 'https://giscus.app') return
      if (event.source !== frame()?.contentWindow) return

      queueMicrotask(flushPendingTheme)
    }

    function handleFrameLoad(event: Event): void {
      if (!(event.target instanceof HTMLIFrameElement)) return
      queueMicrotask(flushPendingTheme)
    }

    function scheduleThemeUpdate(): void {
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
      updateFrame = requestAnimationFrame(() => {
        updateFrame = undefined
        updateTheme(true)
      })
    }

    function isThemeStyleNode(node: Node): boolean {
      const element = node instanceof Element ? node : node.parentElement
      return Boolean(element?.closest('#inpress-overrides'))
    }

    function observesThemeChange(records: MutationRecord[]): boolean {
      return records.some((record) => {
        if (record.type === 'attributes') return true
        if (isThemeStyleNode(record.target)) return true

        return [...record.addedNodes, ...record.removedNodes].some(
          isThemeStyleNode
        )
      })
    }

    function preloadStylesheet(url: string): void {
      if (!url.startsWith('https://')) return

      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      link.crossOrigin = 'anonymous'
      link.addEventListener('load', () => link.remove(), { once: true })
      link.addEventListener('error', () => link.remove(), { once: true })
      preloadLinks.push(link)
      document.head.append(link)
    }

    function preloadAppearanceThemes(): void {
      const urls =
        props.config.theme === inPressGiscusTheme
          ? Object.values(inPressGiscusBaseThemes)
          : [
              resolveGiscusThemeStylesheet(
                resolveGiscusTheme(props.config.theme, false)
              ),
              resolveGiscusThemeStylesheet(
                resolveGiscusTheme(props.config.theme, true)
              )
            ]

      for (const url of new Set(urls)) preloadStylesheet(url)
    }

    const appearanceController: GiscusAppearanceController = {
      apply(targetDark) {
        requestedDark = targetDark
        updateTheme()
      }
    }

    watch(
      isDark,
      (targetDark) => {
        requestedDark = targetDark
        if (
          usesExplicitWebKitTheme &&
          !document.documentElement.classList.contains(
            'inpress-appearance-transition-running'
          )
        ) {
          void nextTick(updateTheme)
        }
      },
      { flush: 'sync' }
    )

    onMounted(() => {
      const target = container.value
      if (!target) return

      if (usesExplicitWebKitTheme) preloadAppearanceThemes()

      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.setAttribute('data-repo', props.config.repo)
      script.setAttribute('data-repo-id', props.config.repoId)
      script.setAttribute('data-category', props.config.category)
      script.setAttribute('data-category-id', props.config.categoryId)
      script.setAttribute('data-mapping', props.config.mapping ?? 'pathname')
      script.setAttribute('data-strict', props.config.strict ? '1' : '0')
      script.setAttribute(
        'data-reactions-enabled',
        props.config.reactionsEnabled === false ? '0' : '1'
      )
      script.setAttribute(
        'data-emit-metadata',
        props.config.emitMetadata ? '1' : '0'
      )
      script.setAttribute(
        'data-input-position',
        props.config.inputPosition ?? 'bottom'
      )
      sentTheme = currentTheme()
      script.setAttribute('data-theme', sentTheme)
      script.setAttribute('data-lang', props.config.lang ?? lang.value)
      if (props.config.term) script.setAttribute('data-term', props.config.term)
      if (props.config.loading) {
        script.setAttribute('data-loading', props.config.loading)
      }

      window.addEventListener('message', handleGiscusMessage)
      target.addEventListener('load', handleFrameLoad, true)
      if (usesExplicitWebKitTheme) {
        appearanceControllers.add(appearanceController)
      }
      target.append(script)

      if (props.config.theme === inPressGiscusTheme) {
        themeObserver = new MutationObserver((records) => {
          if (observesThemeChange(records)) scheduleThemeUpdate()
        })
        themeObserver.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        })
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['style']
        })
      }
    })

    onUnmounted(() => {
      themeObserver?.disconnect()
      appearanceControllers.delete(appearanceController)
      window.removeEventListener('message', handleGiscusMessage)
      container.value?.removeEventListener('load', handleFrameLoad, true)
      for (const link of preloadLinks) link.remove()
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
    })

    return () => h('div', { class: 'inpress-giscus', ref: container })
  }
})
