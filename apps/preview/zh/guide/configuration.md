# 配置与 API

## 主题入口

在 `.vitepress/theme/index.ts` 中使用默认导出：

```ts
import theme from '@inp146/vitepress-theme'

export default theme
```

使用构建后的包时，需要同时导入主题样式：

```ts
import '@inp146/vitepress-theme/style.css'
```

同时导出的 `createTheme()` 用于程序化组合，目前不接收参数。站点相关设置直接放在 `themeConfig`。

## 主题设置

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    cssVars: {
      root: {
        '--vp-c-brand-1': '#0f766e'
      },
      dark: {
        '--vp-c-brand-1': '#2dd4bf'
      }
    },
    linkIcons: ['github', 'youtube'],
    hideLinkUnderline: false,
    appearanceTransition: false,
    analytics: {
      googleAnalytics: 'G-XXXXXXXXXX',
      clarity: 'xxxxxxxxxx'
    },
    giscus: {
      repo: 'owner/repository',
      repoId: 'R_kgDO...',
      category: 'Announcements',
      categoryId: 'DIC_kwDO...'
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
| `appearanceTransition` | `boolean \| 'spread' \| 'fade'` | `true` | 浏览器支持 View Transition API 时，选择深浅色切换动画。`true` 和 `'spread'` 表示从切换按钮位置扩散，`'fade'` 表示渐变，`false` 表示关闭。 |
| `analytics` | `AnalyticsConfig \| false` | - | 启用 Google Analytics、Microsoft Clarity 或同时启用两者。设为 `false` 关闭。 |
| `giscus` | `GiscusConfig \| false` | - | 在每篇文档页底部启用 Giscus。设为 `false` 关闭。 |

## 主题调试面板

可在开发页面或公开演示页中导入可选的调试组件：

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/vitepress-theme/playground'
</script>

<ClientOnly>
  <ThemeConfigPlayground persist />
</ClientOnly>
```

面板可调整本主题的颜色、记号笔 token、平台链接样式、链接行为、深浅色切换动画和 Giscus 显示状态，不修改 VitePress 的导航或侧边栏配置。只有站点已经提供有效的 `giscus` 配置时才能开启 Giscus。面板刻意不提供 Analytics 控制，避免游客操作时加载追踪脚本。

设置 `initially-open` 可在首次渲染时直接展开面板。`persist` 会把当前设置保存到本地存储；需要自定义键名时可传入 `storage-key`。通过高级编辑器添加的任意 CSS 变量也会包含在生成的 `themeConfig` 中。

## 模式切换动画

将 `appearanceTransition` 设为 `'spread'`，新主题会从切换按钮的位置扩散；设为 `'fade'`，深浅色主题会渐变切换。`true` 仍等同于 `'spread'`。未支持 View Transition API 的浏览器，以及偏好减少动态效果的用户，会保留 VitePress 原本的即时切换。设置 `appearanceTransition: false` 可关闭动画。

## 访问分析

可填写 GA4 衡量 ID、Microsoft Clarity 项目 ID，或同时填写两者：

```ts
analytics: {
  googleAnalytics: 'G-XXXXXXXXXX',
  clarity: 'xxxxxxxxxx'
}
```

Google Analytics 会记录首次访问以及后续的 VitePress 客户端路由跳转。Clarity 只初始化一次，并在客户端路由跳转时保持同一会话。未配置 `analytics` 或设为 `false` 时，不会加载任何分析脚本。

## Giscus 评论

Giscus 会将评论存储为 GitHub Discussions。用户需要先到 [giscus.app](https://giscus.app) 为自己的仓库完成配置，再把 `giscus` 写入 `themeConfig`：

1. 在目标仓库启用 Discussions，并安装 [Giscus GitHub App](https://github.com/apps/giscus)。
2. 打开 [giscus.app](https://giscus.app)，填写仓库、选择讨论分类，并设置页面映射和语言。
3. 将页面生成的 `repo`、`repoId`、`category`、`categoryId` 复制到 `themeConfig`。

```ts
giscus: {
  repo: 'owner/repository',
  repoId: 'R_kgDO...',
  category: 'Announcements',
  categoryId: 'DIC_kwDO...',
  mapping: 'url',
  inputPosition: 'bottom',
  lang: 'zh-CN'
}
```

评论显示在文档页脚后。应使用 giscus.app 中选择的映射方式：`pathname` 会为每个页面创建独立的讨论，`url` 则会使用完整页面 URL。组件默认跟随 VitePress 的浅色或深色模式。`preferred_color_scheme` 只跟随操作系统设置；若需要跟随 VitePress 的模式切换，请使用分别指定浅色和深色主题的对象。需要自定义 Giscus 主题时，传入 `theme: 'https://example.com/giscus-theme.css'`；也可以分别配置两种模式：

```ts
theme: {
  light: 'light',
  dark: 'dark_dimmed'
}
```

在单篇文档的 frontmatter 中设置 `giscus: false`，可隐藏该页评论。

## 文本记号笔

下划线记号笔适合短文本强调，笔刷高亮适合标记一段文字：

<p><mark>下划线记号笔</mark></p>
<p><mark class="highlight">笔刷风格高亮文本</mark></p>

```html
<mark>下划线记号笔</mark>
<mark class="highlight">笔刷风格高亮文本</mark>
```

两种记号笔默认跟随 VitePress 全局品牌色。可通过 `--theme-marker-color` 或 `--theme-marker-highlight-color` 覆盖颜色，通过 `--theme-marker-thickness`、`--theme-marker-offset` 和 `--theme-marker-highlight-radius` 调整形态。

## 侧边栏层级

一级页面链接默认相对分组标题缩进 `16px`，可通过 `--theme-sidebar-indent` 调整。

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

## 包导出

| 导出项 | 导入路径 | 说明 |
| --- | --- | --- |
| 默认主题 | `@inp146/vitepress-theme` | 用于 `.vitepress/theme/index.ts` 的主题对象。 |
| `createTheme()` | `@inp146/vitepress-theme` | 用于程序化创建同一主题对象。 |
| `linkIconProviders` | `@inp146/vitepress-theme` | 包含所有支持平台标识符的数组。 |
| `LinkIconProvider` | `@inp146/vitepress-theme` | 平台标识符的联合类型。 |
| `ThemeCssVars` | `@inp146/vitepress-theme` | CSS 自定义属性记录的类型。 |
| `AnalyticsConfig` | `@inp146/vitepress-theme` | Google Analytics 与 Microsoft Clarity 的配置类型。 |
| `GiscusConfig` | `@inp146/vitepress-theme` | Giscus 小组件的配置类型。 |
| `Inp146ThemeConfig` | `@inp146/vitepress-theme` | `themeConfig` 中主题专属字段的类型。 |
| `ThemeConfigPlayground` | `@inp146/vitepress-theme/playground` | 用于实时调整主题设置和 CSS 变量的组件。 |

## 界面语言

通过 Node 安全的子路径导入 `themeI18n`，再将对应 preset 展开到 VitePress 配置中：

```ts
import { themeI18n } from '@inp146/vitepress-theme/i18n'

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        ...themeI18n.en
      }
    },
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
