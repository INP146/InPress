import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { themeI18n } from '@inp146/inpress/i18n'
import { createSidebar, sidebarHmrPlugin } from './sidebar'

const sharedThemeConfig = {
  color: '#ff6090',
  playground: true,
  logo: '/logo.svg',
  logoMonochrome: true,
  homeLogoMonochrome: true,
  socialLinks: [
    { icon: 'github' as const, link: 'https://github.com/INP146/inpress' }
  ],
  appearanceTransition: 'fade'
}
const useBuiltPackage = process.env.INPRESS_USE_DIST === '1'

export default defineConfig({
  title: 'InPress',
  description:
    'A reusable VitePress theme with brand customization and documentation-focused enhancements.',
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        ...themeI18n.en,
        ...sharedThemeConfig,
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/config/color' },
          { text: 'API', link: '/api/default-theme' },
          { text: 'Components', link: '/showcase/components' },
          { text: 'Playground', link: '/playground' }
        ],
        sidebar: createSidebar('en'),
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 INP146'
        },
        giscus: {
          repo: 'INP146/inpress',
          repoId: 'R_kgDOTWQyyQ',
          category: 'Announcements',
          categoryId: 'DIC_kwDOTWQyyc4DBHZH',
          mapping: 'url',
          strict: false,
          reactionsEnabled: true,
          emitMetadata: false,
          inputPosition: 'top',
          theme: {
            light: '/giscus/light.css',
            dark: '/giscus/dark.css'
          },
          lang: 'en',
          loading: 'lazy'
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'InPress',
      description: '提供品牌配置与文档增强能力的可复用 VitePress 主题。',
      themeConfig: {
        ...themeI18n.zh,
        ...sharedThemeConfig,
        nav: [
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: '配置', link: '/zh/config/color' },
          { text: 'API', link: '/zh/api/default-theme' },
          { text: '组件', link: '/zh/showcase/components' },
          { text: 'Playground', link: '/zh/playground' }
        ],
        sidebar: createSidebar('zh'),
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: 'Copyright © 2026 INP146'
        },
        giscus: {
          repo: 'INP146/inpress',
          repoId: 'R_kgDOTWQyyQ',
          category: 'Announcements',
          categoryId: 'DIC_kwDOTWQyyc4DBHZH',
          mapping: 'url',
          strict: false,
          reactionsEnabled: true,
          emitMetadata: false,
          inputPosition: 'top',
          theme: {
            light: '/giscus/light.css',
            dark: '/giscus/dark.css'
          },
          lang: 'zh-CN',
          loading: 'lazy'
        }
      }
    }
  },
  vite: {
    plugins: [sidebarHmrPlugin],
    resolve: {
      alias: useBuiltPackage
        ? {}
        : {
            '@inp146/inpress/playground': fileURLToPath(
              new URL(
                '../../../packages/inpress/src/playground.ts',
                import.meta.url
              )
            ),
            '@inp146/inpress': fileURLToPath(
              new URL('../../../packages/inpress/src/index.ts', import.meta.url)
            )
          }
    }
  }
})
