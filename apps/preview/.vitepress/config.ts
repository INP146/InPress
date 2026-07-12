import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Theme Playground',
  description: 'Development preview for @your-scope/vitepress-theme',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Showcase', link: '/showcase/components' }
    ],
    sidebar: [
      {
        text: 'Theme development',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Publishing', link: '/guide/publishing' }
        ]
      },
      {
        text: 'Showcase',
        items: [{ text: 'Components', link: '/showcase/components' }]
      }
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
    footer: {
      message: 'Built on VitePress 2.0 alpha.',
      copyright: 'Copyright 2026'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@your-scope/vitepress-theme': fileURLToPath(
          new URL('../../../packages/theme/src/index.ts', import.meta.url)
        )
      }
    }
  }
})
