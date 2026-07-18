import {
  defineComponent,
  h,
  onMounted,
  ref,
  watch,
  type PropType
} from 'vue'
import { useData } from 'vitepress'
import {
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

    function updateTheme(): void {
      const frame = container.value?.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      )

      frame?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: resolveGiscusTheme(props.config.theme, isDark.value)
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
        resolveGiscusTheme(props.config.theme, isDark.value)
      )
      script.setAttribute('data-lang', props.config.lang ?? lang.value)
      if (props.config.term) script.setAttribute('data-term', props.config.term)
      if (props.config.loading) {
        script.setAttribute('data-loading', props.config.loading)
      }

      target.append(script)
    })

    return () => h('div', { class: 'inpress-giscus', ref: container })
  }
})
