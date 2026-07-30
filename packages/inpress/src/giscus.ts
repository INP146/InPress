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
  createInPressGiscusTheme,
  inPressGiscusTheme,
  resolveGiscusTheme,
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
    const { isDark, lang } = useData()
    const container = ref<HTMLDivElement>()
    let themeObserver: MutationObserver | undefined
    let updateFrame: number | undefined

    function currentTheme(): string {
      if (props.config.theme !== inPressGiscusTheme) {
        return resolveGiscusTheme(props.config.theme, isDark.value)
      }

      const styles = getComputedStyle(document.documentElement)
      return createInPressGiscusTheme(isDark.value, (name) => {
        const value = styles.getPropertyValue(name).trim()
        return value && CSS.supports('color', value) ? value : ''
      })
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

    watch(
      isDark,
      () => void nextTick(scheduleThemeUpdate),
      { flush: 'post' }
    )

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
          attributeFilter: ['class', 'style']
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
