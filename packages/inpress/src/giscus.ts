import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  type PropType
} from 'vue'
import { useData } from 'vitepress'
import {
  createAdaptiveGiscusTheme,
  createInPressGiscusTheme,
  inPressGiscusTheme,
  inPressGiscusCssVariables,
  type GiscusThemeValue
} from './giscus-theme'

export type { GiscusTheme } from './giscus-theme'

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
    const { lang } = useData()
    const container = ref<HTMLDivElement>()
    let themeObserver: MutationObserver | undefined
    let updateFrame: number | undefined

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

    function currentTheme(): string {
      if (props.config.theme !== inPressGiscusTheme) {
        return createAdaptiveGiscusTheme(props.config.theme)
      }

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

      return createInPressGiscusTheme(
        (name) => read(light, name),
        (name) => read(dark, name)
      )
    }

    function updateTheme(): void {
      const frame = container.value?.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      )

      frame?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: currentTheme()
            }
          }
        },
        'https://giscus.app'
      )
    }

    function scheduleThemeUpdate(): void {
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
      updateFrame = requestAnimationFrame(() => {
        updateFrame = undefined
        updateTheme()
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

    onMounted(() => {
      const target = container.value
      if (!target) return

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
      script.setAttribute('data-theme', currentTheme())
      script.setAttribute('data-lang', props.config.lang ?? lang.value)
      if (props.config.term) script.setAttribute('data-term', props.config.term)
      if (props.config.loading) {
        script.setAttribute('data-loading', props.config.loading)
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
      if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
    })

    return () => h('div', { class: 'inpress-giscus', ref: container })
  }
})
