import type { DefaultTheme } from 'vitepress'
import { generateSidebar } from '@inp146/inpress/sidebar'

type Locale = 'en' | 'zh'

type SidebarSection = {
  path: string
  labels: Record<Locale, string>
  collapsed?: boolean
}

const sections: SidebarSection[] = [
  {
    path: 'guide',
    labels: { en: 'Guide', zh: '使用指南' }
  },
  {
    path: 'config',
    labels: { en: 'Configuration', zh: '配置' },
    collapsed: false
  },
  {
    path: 'api',
    labels: { en: 'API', zh: 'API' },
    collapsed: false
  },
  {
    path: 'showcase',
    labels: { en: 'Components', zh: '组件' }
  }
]

function createSection(
  section: SidebarSection,
  locale: Locale
): DefaultTheme.SidebarItem {
  const localePath = locale === 'zh' ? 'zh/' : ''
  const scanStartPath = `${localePath}${section.path}`
  const base = `/${scanStartPath}/`
  const generated = generateSidebar([
    {
      documentRootPath: '/',
      scanStartPath,
      resolvePath: base,
      basePath: base,
      useTitleFromFileHeading: true,
      sortMenusOrderNumericallyFromLink: true
    }
  ])

  if (Array.isArray(generated) || !generated[base]) {
    throw new Error(`Failed to generate sidebar section for ${base}`)
  }

  return {
    text: section.labels[locale],
    base: generated[base].base,
    items: generated[base].items,
    ...(section.collapsed === undefined
      ? {}
      : { collapsed: section.collapsed })
  }
}

export function createSidebar(locale: Locale): DefaultTheme.SidebarItem[] {
  return sections.map((section) => createSection(section, locale))
}

type SidebarDevServer = {
  restart(): Promise<void>
  watcher: {
    on(event: 'add' | 'unlink', callback: (path: string) => void): void
  }
}

export const sidebarHmrPlugin = {
  name: 'inpress:auto-sidebar-restart',
  apply: 'serve' as const,
  configureServer(server: SidebarDevServer) {
    let restartPromise: Promise<void> | undefined
    const restartForMarkdown = (path: string) => {
      if (!path.endsWith('.md') || restartPromise) return
      restartPromise = server.restart().finally(() => {
        restartPromise = undefined
      })
    }

    server.watcher.on('add', restartForMarkdown)
    server.watcher.on('unlink', restartForMarkdown)
  }
}
