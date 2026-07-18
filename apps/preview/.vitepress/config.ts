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
          { text: 'Theme playground', link: '/playground' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting started', link: '/guide/getting-started' },
              { text: 'Theme contract', link: '/guide/theme-contract' },
              { text: 'Style extensions', link: '/guide/style-extensions' },
              { text: 'Publishing', link: '/guide/publishing' }
            ]
          },
          {
            text: 'Configuration',
            collapsed: false,
            items: [
              { text: 'color', link: '/config/color' },
              { text: 'favicon', link: '/config/favicon' },
              { text: 'logoMonochrome', link: '/config/logo-monochrome' },
              {
                text: 'homeLogoMonochrome',
                link: '/config/home-logo-monochrome'
              },
              { text: 'linkIcons', link: '/config/link-icons' },
              { text: 'autoLinkText', link: '/config/auto-link-text' },
              {
                text: 'hideLinkUnderline',
                link: '/config/hide-link-underline'
              },
              {
                text: 'appearanceTransition',
                link: '/config/appearance-transition'
              },
              { text: 'playground', link: '/config/playground' },
              { text: 'analytics', link: '/config/analytics' },
              { text: 'giscus', link: '/config/giscus' }
            ]
          },
          {
            text: 'API',
            collapsed: false,
            items: [
              { text: 'Default theme', link: '/api/default-theme' },
              { text: 'style.css', link: '/api/style-css' },
              {
                text: 'ThemeConfigPlayground',
                link: '/api/theme-config-playground'
              },
              { text: 'ThemeCheckbox', link: '/api/theme-checkbox' },
              { text: 'ThemeSwitch', link: '/api/theme-switch' },
              { text: 'linkIconProviders', link: '/api/link-icon-providers' },
              { text: 'themeI18n', link: '/api/theme-i18n' },
              { text: 'InPressThemeConfig', link: '/api/inpress-theme-config' },
              { text: 'ThemeColor', link: '/api/theme-color' },
              { text: 'FaviconConfig', link: '/api/favicon-config' },
              { text: 'LinkIconProvider', link: '/api/link-icon-provider' },
              {
                text: 'AppearanceTransitionMode',
                link: '/api/appearance-transition-mode'
              },
              {
                text: 'ThemePlaygroundConfig',
                link: '/api/theme-playground-config'
              },
              { text: 'AnalyticsConfig', link: '/api/analytics-config' },
              { text: 'GiscusConfig', link: '/api/giscus-config' },
              { text: 'GiscusMapping', link: '/api/giscus-mapping' },
              { text: 'GiscusTheme', link: '/api/giscus-theme' }
            ]
          },
          {
            text: 'Components',
            items: [{ text: 'Showcase', link: '/showcase/components' }]
          }
        ],
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
        sidebar: [
          {
            text: '使用指南',
            items: [
              { text: '快速开始', link: '/zh/guide/getting-started' },
              { text: '主题契约', link: '/zh/guide/theme-contract' },
              { text: '样式扩展', link: '/zh/guide/style-extensions' },
              { text: '发布', link: '/zh/guide/publishing' }
            ]
          },
          {
            text: '配置',
            collapsed: false,
            items: [
              { text: 'color', link: '/zh/config/color' },
              { text: 'favicon', link: '/zh/config/favicon' },
              { text: 'logoMonochrome', link: '/zh/config/logo-monochrome' },
              {
                text: 'homeLogoMonochrome',
                link: '/zh/config/home-logo-monochrome'
              },
              { text: 'linkIcons', link: '/zh/config/link-icons' },
              { text: 'autoLinkText', link: '/zh/config/auto-link-text' },
              {
                text: 'hideLinkUnderline',
                link: '/zh/config/hide-link-underline'
              },
              {
                text: 'appearanceTransition',
                link: '/zh/config/appearance-transition'
              },
              { text: 'playground', link: '/zh/config/playground' },
              { text: 'analytics', link: '/zh/config/analytics' },
              { text: 'giscus', link: '/zh/config/giscus' }
            ]
          },
          {
            text: 'API',
            collapsed: false,
            items: [
              { text: '默认主题', link: '/zh/api/default-theme' },
              { text: 'style.css', link: '/zh/api/style-css' },
              {
                text: 'ThemeConfigPlayground',
                link: '/zh/api/theme-config-playground'
              },
              { text: 'ThemeCheckbox', link: '/zh/api/theme-checkbox' },
              { text: 'ThemeSwitch', link: '/zh/api/theme-switch' },
              {
                text: 'linkIconProviders',
                link: '/zh/api/link-icon-providers'
              },
              { text: 'themeI18n', link: '/zh/api/theme-i18n' },
              {
                text: 'InPressThemeConfig',
                link: '/zh/api/inpress-theme-config'
              },
              { text: 'ThemeColor', link: '/zh/api/theme-color' },
              { text: 'FaviconConfig', link: '/zh/api/favicon-config' },
              { text: 'LinkIconProvider', link: '/zh/api/link-icon-provider' },
              {
                text: 'AppearanceTransitionMode',
                link: '/zh/api/appearance-transition-mode'
              },
              {
                text: 'ThemePlaygroundConfig',
                link: '/zh/api/theme-playground-config'
              },
              { text: 'AnalyticsConfig', link: '/zh/api/analytics-config' },
              { text: 'GiscusConfig', link: '/zh/api/giscus-config' },
              { text: 'GiscusMapping', link: '/zh/api/giscus-mapping' },
              { text: 'GiscusTheme', link: '/zh/api/giscus-theme' }
            ]
          },
          {
            text: '组件',
            items: [{ text: '组件展示', link: '/zh/showcase/components' }]
          }
        ],
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
