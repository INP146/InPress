# 配置与 API

## 主题入口

在 `.vitepress/theme/index.ts` 中使用默认导出：

```ts
import theme from '@inp146/inpress'

export default theme
```

主题入口会自动加载核心与组件样式。需要只引入 CSS 时，仍可使用 `style.css` 子路径。

## 主题设置

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#0f766e',
    logoMonochrome: true,
    homeLogoMonochrome: true,
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
| `color` | `ThemeColor` | - | 用于生成具有可读对比度的浅色与深色品牌、按钮 token；仅接受 `#RGB` 或 `#RRGGBB`。 |
| `favicon` | `boolean \| ThemeableImage` | `true` | 默认使用导航栏 Logo。设为 `false` 可关闭，也可传入独立图片；VitePress `head` 中显式配置的 favicon 优先。 |
| `logoMonochrome` | `boolean` | `false` | 导航栏 Logo 使用与旁边站点标题相同的颜色。 |
| `homeLogoMonochrome` | `boolean` | `false` | 将主页 Hero 图片作为单色蒙版，并使用当前品牌色 token 着色。 |
| `linkIcons` | `boolean \| LinkIconProvider[]` | `true` | 默认启用全部平台图标。设为 `false` 关闭，传入列表可只启用部分平台。 |
| `autoLinkText` | `boolean` | `true` | 将无显式文案的 GitHub、GitLab URL 显示为 `user/repo`，npm 包 URL 显示为包名。设为 `false` 保留 URL 文本。 |
| `hideLinkUnderline` | `boolean` | `true` | 隐藏 `.vp-doc` 内链接的文字下划线。设为 `false` 恢复 VitePress 默认样式。 |
| `appearanceTransition` | `boolean \| 'spread' \| 'fade'` | `true` | 浏览器支持 View Transition API 时，选择深浅色切换动画。`true` 和 `'spread'` 表示从切换按钮位置扩散，`'fade'` 表示渐变，`false` 表示关闭。 |
| `playground` | `boolean \| { storageKey?: string }` | `false` | 为 `ThemeConfigPlayground` 启用本地存储。设为 `true` 使用默认键名，也可通过 `storageKey` 隔离保存的设置。 |
| `analytics` | `AnalyticsConfig \| false` | - | 启用 Google Analytics、Microsoft Clarity 或同时启用两者。设为 `false` 关闭。 |
| `giscus` | `GiscusConfig \| false` | - | 在每篇文档页底部启用 Giscus。设为 `false` 关闭。 |

生成的颜色声明具有高于普通站点 CSS 的选择器优先级。如果站点需要在主题样式表中手动定义 VitePress 的品牌与按钮 token，请省略 `color`。几何、排版等其他 CSS 自定义属性也应放在该样式表中。

### Favicon 几何设置

消费站可在自己的主题样式表中调整由主题管理的 favicon：

```css
:root {
  --inpress-favicon-size: 100%;
  --inpress-favicon-offset-x: 0%;
  --inpress-favicon-offset-y: 0%;
}
```

数值是 favicon 视口的百分比。`size` 以中心为基准缩放，两个 offset 只移动图像，不改变尺寸。通过 VitePress `head` 显式声明的 favicon 不受这些变量影响。

## 主题 Playground

可把 Playground 表单直接放在任意开发页面或公开演示页中：

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/inpress/playground'
</script>

<ThemeConfigPlayground />
```

组件不接收 props，并会在插入位置直接渲染表单。表单修改的是共享的运行时主题状态，因此品牌颜色、平台链接样式、链接行为、深浅色切换动画和 Giscus 显示状态会作用于当前 SPA 的整个站点，而不是单独的预览区域。它不会修改 VitePress 的导航、侧边栏配置或任意 CSS 自定义属性。只有站点已经提供有效的 `giscus` 配置时才能开启 Giscus。表单刻意不提供 Analytics 控制，避免游客操作时加载追踪脚本。

通过站点配置启用持久化：

```ts
themeConfig: {
  playground: true
}
```

`true` 会使用 InPress 的默认本地存储键名保存修改，因此刷新页面后设置仍会保留。若同一来源下的多个站点或 Playground 需要隔离设置，可使用 `playground: { storageKey: 'my-site-theme' }`。省略 `playground` 或设为 `false` 时，修改仍会在当前 SPA 会话中全站生效，但刷新页面后会丢失。生成的 `themeConfig` 会包含所选的 `color` 种子和功能设置。

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

评论显示在文档页脚后。应使用 giscus.app 中选择的映射方式：`pathname` 会为每个页面创建独立的讨论，`url` 则会使用完整页面 URL。组件默认跟随 VitePress 的浅色或深色模式。`preferred_color_scheme` 只跟随操作系统设置；若需要跟随 VitePress 的模式切换，请使用分别指定浅色和深色主题的对象。需要自定义 Giscus 主题时，可以传入 HTTPS URL 或站点根相对 CSS 路径。InPress 会先把根相对路径解析为当前站点的绝对 URL，再传给 Giscus：

```ts
theme: {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

Giscus 会从 iframe 中加载这份样式，因此 CSS 响应必须允许 `https://giscus.app` 跨域访问。使用 Cloudflare Workers Static Assets 时，可在 `_headers` 中加入 `Access-Control-Allow-Origin: https://giscus.app`。HTTPS iframe 无法加载普通 HTTP 样式，因此 InPress 会在常规本地开发环境中自动回退到对应的内置 `light` 或 `dark` 主题。

在单篇文档的 frontmatter 中设置 `giscus: false`，可隐藏该页评论。

## 文本记号笔

下划线记号笔适合短文本强调，笔刷高亮适合标记一段文字：

<p><mark>下划线记号笔</mark></p>
<p><mark class="highlight">笔刷风格高亮文本</mark></p>

```html
<mark>下划线记号笔</mark>
<mark class="highlight">笔刷风格高亮文本</mark>
```

两种记号笔默认使用 VitePress 全局品牌 token，包括由 `color` 生成的色板。可通过 `--inpress-marker-color` 或 `--inpress-marker-highlight-color` 覆盖记号笔专用颜色，通过 `--inpress-marker-thickness`、`--inpress-marker-offset` 和 `--inpress-marker-highlight-radius` 调整形态。

## 侧边栏层级

一级页面链接默认相对分组标题缩进 `16px`，可通过 `--inpress-sidebar-indent` 调整。

## 平台链接图标

`LinkIconProvider` 可取：`github`、`gitlab`、`npm`、`discord`、`telegram`、`linkedin`、`reddit`、`twitch`、`tiktok`、`weibo`、`xiaohongshu`、`zhihu`、`juejin`、`x`、`instagram`、`threads`、`youtube`、`bilibili`。

`x` 同时匹配 `twitter.com`，`youtube` 同时匹配 `youtu.be`，`bilibili` 同时匹配 `b23.tv`，`discord` 同时匹配 `discord.gg`，`telegram` 同时匹配 `t.me` 和 `telegram.me`。

对于没有显式文案的自动链接，GitHub、GitLab 会显示为 `user/repo`，npm 会显示为包名。例如 `<https://github.com/vuejs/vitepress>` 显示为 `vuejs/vitepress`。显式 Markdown 文案，例如 `[VitePress](https://github.com/vuejs/vitepress)`，不会被修改。

以下 CSS 自定义属性可调整所有平台图标：

| Token | 默认值 | 说明 |
| --- | --- | --- |
| `--inpress-provider-link-icon-size` | `20px` | 通用图标高度和正方形图标宽度。 |
| `--inpress-provider-link-icon-threads-width` | `17.5px` | 保持 Threads 原始比例的宽度。 |
| `--inpress-provider-link-icon-gap` | `4px` | 图标与链接文字之间的间距。 |
| `--inpress-provider-link-icon-align` | `middle` | 行内垂直对齐方式。 |
| `--inpress-provider-link-icon-offset` | `-1px` | 最终视觉垂直偏移。 |

## 包导出

| 导出项 | 导入路径 | 说明 |
| --- | --- | --- |
| 默认主题 | `@inp146/inpress` | 用于 `.vitepress/theme/index.ts` 的主题对象。 |
| `linkIconProviders` | `@inp146/inpress` | 包含所有支持平台标识符的数组。 |
| `LinkIconProvider` | `@inp146/inpress` | 平台标识符的联合类型。 |
| `ThemeColor` | `@inp146/inpress` | 十六进制品牌颜色种子的类型。 |
| `AnalyticsConfig` | `@inp146/inpress` | Google Analytics 与 Microsoft Clarity 的配置类型。 |
| `GiscusConfig` | `@inp146/inpress` | Giscus 小组件的配置类型。 |
| `InPressThemeConfig` | `@inp146/inpress` | `themeConfig` 中主题专属字段的类型。 |
| `ThemeCheckbox` | `@inp146/inpress` | 带文案、焦点、选中和禁用状态的通用 checkbox 控件。 |
| `ThemeConfigPlayground` | `@inp146/inpress/playground` | 页面内运行时编辑器，修改会作用于当前站点会话。 |
| `ThemeSwitch` | `@inp146/inpress` | 用于立即生效布尔设置的通用 switch 控件。 |

## 界面语言

通过 Node 安全的子路径导入 `themeI18n`，再将对应 preset 展开到 VitePress 配置中：

```ts
import { themeI18n } from '@inp146/inpress/i18n'

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
