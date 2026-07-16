import { defineComponent, nextTick, watch, type PropType } from 'vue'
import { useRoute } from 'vitepress'

export interface AnalyticsConfig {
  googleAnalytics?: string
  clarity?: string
}

type ClarityFunction = ((...args: unknown[]) => void) & {
  q?: unknown[][]
}

type AnalyticsWindow = Window & {
  clarity?: ClarityFunction
  dataLayer?: unknown[][]
  gtag?: (...args: unknown[]) => void
}

function appendScript(id: string, src: string, srcPrefix = src): void {
  const existingScript = document.querySelector(
    `script#${id},script[src^="${srcPrefix}"]`
  )
  if (existingScript) return

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.append(script)
}

function trackGooglePageView(measurementId: string, path: string): void {
  const analyticsWindow = window as AnalyticsWindow
  const shouldInitialize = !analyticsWindow.gtag

  analyticsWindow.dataLayer ??= []
  analyticsWindow.gtag ??= (...args: unknown[]) =>
    analyticsWindow.dataLayer!.push(args)

  if (shouldInitialize) analyticsWindow.gtag('js', new Date())

  appendScript(
    'inpress-google-analytics',
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
    'https://www.googletagmanager.com/gtag/js'
  )

  analyticsWindow.gtag('config', measurementId, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
  })
}

function installClarity(projectId: string): void {
  const analyticsWindow = window as AnalyticsWindow

  if (!analyticsWindow.clarity) {
    const clarity: ClarityFunction = (...args: unknown[]) => {
      const queue = (clarity.q ??= [])
      queue.push(args)
    }

    analyticsWindow.clarity = clarity
  }

  appendScript(
    'inpress-clarity',
    `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`,
    'https://www.clarity.ms/tag/'
  )
}

export const Analytics = defineComponent({
  name: 'InPressAnalytics',
  props: {
    config: {
      type: Object as PropType<AnalyticsConfig>,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()

    watch(
      [() => route.path, () => props.config.googleAnalytics],
      async ([path, measurementId]) => {
        if (!measurementId || typeof document === 'undefined') return

        await nextTick()
        trackGooglePageView(measurementId, path)
      },
      { flush: 'post', immediate: true }
    )

    watch(
      () => props.config.clarity,
      (projectId) => {
        if (!projectId || typeof document === 'undefined') return

        installClarity(projectId)
      },
      { immediate: true }
    )

    return () => null
  }
})
