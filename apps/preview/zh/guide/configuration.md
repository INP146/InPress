# 配置与 API

## 主题入口

在 `.vitepress/theme/index.ts` 中使用默认导出：

```ts
import theme from '@inp146/vitepress-theme'

export default theme
```

同时导出的 `createTheme()` 用于程序化组合，目前不接收参数。站点相关设置统一放在 `themeConfig.inp146`。

## 主题设置

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    inp146: {
      cssVars: {
        root: {
          '--vp-c-brand-1': '#0f766e'
        },
        dark: {
          '--vp-c-brand-1': '#2dd4bf'
        }
      },
      linkIcons: ['github', 'youtube'],
      hideLinkUnderline: false
    }
  }
})
```

| 设置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `cssVars.root` | `Record<\`--${string}\`, string \| number>` | - | 应用到 `:root` 的 CSS 自定义属性。 |
| `cssVars.dark` | `Record<\`--${string}\`, string \| number>` | - | 应用到 `:root.dark` 的 CSS 自定义属性。 |
| `linkIcons` | `boolean \| LinkIconProvider[]` | `true` | 默认启用全部平台图标。设为 `false` 关闭，传入列表可只启用部分平台。 |
| `autoLinkText` | `boolean` | `true` | 将无显式文案的 GitHub、GitLab URL 显示为 `user/repo`，npm 包 URL 显示为包名。设为 `false` 保留 URL 文本。 |
| `hideLinkUnderline` | `boolean` | `true` | 隐藏 `.vp-doc` 内链接的文字下划线。设为 `false` 恢复 VitePress 默认样式。 |

## 平台链接图标

`LinkIconProvider` 可取：`github`、`gitlab`、`npm`、`discord`、`telegram`、`linkedin`、`reddit`、`twitch`、`tiktok`、`weibo`、`xiaohongshu`、`zhihu`、`juejin`、`x`、`instagram`、`threads`、`youtube`、`bilibili`。

`x` 同时匹配 `twitter.com`，`youtube` 同时匹配 `youtu.be`，`bilibili` 同时匹配 `b23.tv`，`discord` 同时匹配 `discord.gg`，`telegram` 同时匹配 `t.me` 和 `telegram.me`。

对于没有显式文案的自动链接，GitHub、GitLab 会显示为 `user/repo`，npm 会显示为包名。例如 `<https://github.com/vuejs/vitepress>` 显示为 `vuejs/vitepress`。显式 Markdown 文案，例如 `[VitePress](https://github.com/vuejs/vitepress)`，不会被修改。

以下 CSS 自定义属性可调整所有平台图标：

| Token | 默认值 | 说明 |
| --- | --- | --- |
| `--theme-provider-link-icon-size` | `20px` | 通用图标高度和正方形图标宽度。 |
| `--theme-provider-link-icon-threads-width` | `17.5px` | 保持 Threads 原始比例的宽度。 |
| `--theme-provider-link-icon-gap` | `4px` | 图标与链接文字之间的间距。 |
| `--theme-provider-link-icon-align` | `middle` | 行内垂直对齐方式。 |
| `--theme-provider-link-icon-offset` | `-1px` | 最终视觉垂直偏移。 |
| `--theme-provider-link-icon-github-offset` | 全局偏移再减 `1px` | GitHub 专用的垂直偏移。 |

## 包导出

| 导出项 | 导入路径 | 说明 |
| --- | --- | --- |
| 默认主题 | `@inp146/vitepress-theme` | 用于 `.vitepress/theme/index.ts` 的主题对象。 |
| `createTheme()` | `@inp146/vitepress-theme` | 用于程序化创建同一主题对象。 |
| `ThemeBadge` | `@inp146/vitepress-theme` | 由主题全局注册的 Vue 组件。可选 `label` prop 的默认值为 `Theme component`。 |
| `linkIconProviders` | `@inp146/vitepress-theme` | 包含所有支持平台标识符的数组。 |
| `LinkIconProvider` | `@inp146/vitepress-theme` | 平台标识符的联合类型。 |
| `resolveProviderLinkText()` | `@inp146/vitepress-theme` | 为支持的平台 URL 解析简短显示文案。 |
| `ThemeCssVars` | `@inp146/vitepress-theme` | CSS 自定义属性记录的类型。 |
| `Inp146ThemeSettings` | `@inp146/vitepress-theme` | `themeConfig.inp146` 的类型。 |
| `Inp146ThemeConfig` | `@inp146/vitepress-theme` | 含有 `inp146` 命名空间的类型。 |

## 界面语言

通过 Node 安全的子路径导入 `themeI18n`，再将对应 preset 展开到 VitePress 配置中：

```ts
import { themeI18n } from '@inp146/vitepress-theme/i18n'

export default defineConfig({
  themeConfig: {
    ...themeI18n.en
  },
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        ...themeI18n.zh
      }
    }
  }
})
```
