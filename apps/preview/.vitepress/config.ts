import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { themeI18n } from '@inp146/vitepress-theme/i18n'

export default defineConfig({
  title: 'VitePress Theme',
  description: 'Documentation and development site for @inp146/vitepress-theme',
  cleanUrls: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'VitePress Theme',
      description: '@inp146/vitepress-theme 的文档与开发站',
      themeConfig: {
        ...themeI18n.zh,
        nav: [
          { text: '文档', link: '/zh/guide/getting-started' },
          { text: '组件示例', link: '/zh/showcase/components' }
        ],
        sidebar: [
          {
            text: '主题开发',
            items: [
              { text: '快速开始', link: '/zh/guide/getting-started' },
              { text: '主题契约', link: '/zh/guide/theme-contract' },
              { text: '发布', link: '/zh/guide/publishing' }
            ]
          },
          {
            text: '组件示例',
            items: [{ text: '组件', link: '/zh/showcase/components' }]
          }
        ],
        footer: {
          message: '基于 VitePress 2.0 alpha 构建。',
          copyright: 'Copyright 2026'
        }
      }
    }
  },
  themeConfig: {
    ...themeI18n.en,
    logo: '/logo.svg',
    nav: [
      { text: 'Docs', link: '/guide/getting-started' },
      { text: 'Showcase', link: '/showcase/components' }
    ],
    sidebar: [
      {
        text: 'Theme development',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Theme contract', link: '/guide/theme-contract' },
          { text: 'Publishing', link: '/guide/publishing' }
        ]
      },
      {
        text: 'Showcase',
        items: [{ text: 'Components', link: '/showcase/components' }]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
    footer: {
      message: 'Built on VitePress 2.0 alpha.',
      copyright: 'Copyright 2026'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@inp146/vitepress-theme': fileURLToPath(
          new URL('../../../packages/theme/src/index.ts', import.meta.url)
        )
      }
    }
  }
})
