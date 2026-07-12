import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

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
        outline: {
          label: '本页内容'
        },
        darkModeSwitchLabel: '深色模式',
        lightModeSwitchTitle: '切换为浅色模式',
        darkModeSwitchTitle: '切换为深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳到正文',
        footer: {
          message: '基于 VitePress 2.0 alpha 构建。',
          copyright: 'Copyright 2026'
        }
      }
    }
  },
  themeConfig: {
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
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '未找到结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '向上箭头',
                  navigateDownKeyAriaLabel: '向下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc'
                }
              }
            }
          }
        }
      }
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
        '@inp146/vitepress-theme': fileURLToPath(
          new URL('../../../packages/theme/src/index.ts', import.meta.url)
        )
      }
    }
  }
})
