import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { themeI18n } from '@inp146/vitepress-theme/i18n'

const sharedThemeConfig = {
  cssVars: {
    root: {
      '--vp-c-brand-1': '#0f766e',
      '--vp-c-brand-2': '#0d9488',
      '--vp-c-brand-3': '#14b8a6',
      '--vp-c-brand-soft': 'rgba(20, 184, 166, 0.14)',
      '--vp-button-brand-border': 'transparent',
      '--vp-button-brand-text': '#ffffff',
      '--vp-button-brand-bg': 'var(--vp-c-brand-1)',
      '--vp-button-brand-hover-border': 'transparent',
      '--vp-button-brand-hover-text': '#ffffff',
      '--vp-button-brand-hover-bg': '#115e59',
      '--vp-home-hero-name-color': 'transparent',
      '--vp-home-hero-name-background':
        'linear-gradient(120deg, #0f766e 20%, #2563eb 80%)'
    },
    dark: {
      '--vp-c-brand-1': '#2dd4bf',
      '--vp-c-brand-2': '#5eead4',
      '--vp-c-brand-3': '#99f6e4',
      '--vp-c-brand-soft': 'rgba(45, 212, 191, 0.16)',
      '--vp-button-brand-bg': '#0f766e',
      '--vp-button-brand-hover-bg': '#14b8a6'
    }
  },
  logo: '/logo.svg',
  socialLinks: [{ icon: 'github' as const, link: 'https://github.com' }],
  giscus: {
    repo: 'INP146/vitepress-theme',
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

export default defineConfig({
  title: 'VitePress Theme',
  description: 'Documentation and development site for @inp146/vitepress-theme',
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
          { text: 'Link features', link: '/showcase/components' }
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
            text: 'Link features',
            items: [{ text: 'Links', link: '/showcase/components' }]
          }
        ],
        footer: {
          message: 'Built on VitePress 2.0 alpha.',
          copyright: 'Copyright 2026'
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'VitePress Theme',
      description: '@inp146/vitepress-theme 的文档与开发站',
      themeConfig: {
        ...themeI18n.zh,
        ...sharedThemeConfig,
        nav: [
          { text: '文档', link: '/zh/guide/getting-started' },
          { text: '链接功能', link: '/zh/showcase/components' }
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
            text: '链接功能',
            items: [{ text: '链接', link: '/zh/showcase/components' }]
          }
        ],
        footer: {
          message: '基于 VitePress 2.0 alpha 构建。',
          copyright: 'Copyright 2026'
        }
      }
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
