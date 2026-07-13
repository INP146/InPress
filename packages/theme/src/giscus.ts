import {
  defineComponent,
  h,
  onMounted,
  ref,
  watch,
  type PropType
} from 'vue'
import { useData } from 'vitepress'

export type GiscusMapping =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'

export interface GiscusTheme {
  light: string
  dark: string
}

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
  theme?: string | GiscusTheme
  lang?: string
  loading?: 'lazy'
}

function resolveTheme(theme: GiscusConfig['theme'], isDark: boolean): string {
  if (typeof theme === 'string') return theme

  return theme ? (isDark ? theme.dark : theme.light) : isDark ? 'dark' : 'light'
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

    function updateTheme(): void {
      const frame = container.value?.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      )

      frame?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: resolveTheme(props.config.theme, isDark.value)
            }
          }
        },
        'https://giscus.app'
      )
    }

    watch(isDark, updateTheme, { flush: 'sync' })

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
      script.setAttribute(
        'data-theme',
        resolveTheme(props.config.theme, isDark.value)
      )
      script.setAttribute('data-lang', props.config.lang ?? lang.value)
      if (props.config.term) script.setAttribute('data-term', props.config.term)
      if (props.config.loading) {
        script.setAttribute('data-loading', props.config.loading)
      }

      target.append(script)
    })

    return () => h('div', { class: 'theme-giscus', ref: container })
  }
})
