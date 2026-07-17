import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { themeI18n } from '@inp146/inpress/i18n'

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
  description: 'Documentation and development site for InPress',
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
          { text: 'Docs', link: '/guide/getting-started' },
          { text: 'Components', link: '/showcase/components' },
          { text: 'Playground', link: '/playground' }
        ],
        sidebar: [
          {
            text: 'Theme development',
            items: [
              { text: 'Getting started', link: '/guide/getting-started' },
              { text: 'Configuration & API', link: '/guide/configuration' },
              { text: 'Theme contract', link: '/guide/theme-contract' },
              { text: 'Publishing', link: '/guide/publishing' }
            ]
          },
          {
            text: 'Components',
            items: [{ text: 'Showcase', link: '/showcase/components' }]
          }
        ],
        footer: {
          message: 'Built on VitePress 2.0 alpha.',
          copyright: 'Copyright 2026'
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
            light: 'light',
            dark: 'dark'
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
      description: 'InPress 的文档与开发站',
      themeConfig: {
        ...themeI18n.zh,
        ...sharedThemeConfig,
        nav: [
          { text: '文档', link: '/zh/guide/getting-started' },
          { text: '组件', link: '/zh/showcase/components' },
          { text: '主题调试', link: '/zh/playground' }
        ],
        sidebar: [
          {
            text: '主题开发',
            items: [
              { text: '快速开始', link: '/zh/guide/getting-started' },
              { text: '配置与 API', link: '/zh/guide/configuration' },
              { text: '主题契约', link: '/zh/guide/theme-contract' },
              { text: '发布', link: '/zh/guide/publishing' }
            ]
          },
          {
            text: '组件',
            items: [{ text: '组件展示', link: '/zh/showcase/components' }]
          }
        ],
        footer: {
          message: '基于 VitePress 2.0 alpha 构建。',
          copyright: 'Copyright 2026'
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
            light: 'light',
            dark: 'dark'
          },
          lang: 'zh-CN',
          loading: 'lazy'
        }
      }
    }
  },
  vite: {
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
