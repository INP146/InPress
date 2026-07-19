# 自动侧边栏

InPress 已经包含 `vitepress-sidebar`，并通过 `@inp146/inpress/sidebar` 导出。消费端无需再安装其他包。

## 选择 API

| API | 适用场景 | 开发期更新 |
| --- | --- | --- |
| `withSidebar` | VitePress 可以完全接管顶层 `themeConfig.sidebar` | 添加或删除 Markdown 时会重启 VitePress |
| `generateSidebar` | 需要手动组合侧边栏，或将数据放入 locale 的 `themeConfig` | 在 VitePress 加载配置时生成 |

`withSidebar` 会覆盖现有的顶层 `themeConfig.sidebar`。如果需要混合手写分组和生成分组，请使用 `generateSidebar`。

## 全站侧边栏

如果所有文档页都使用同一个侧边栏，推荐使用以下配置：

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withSidebar } from '@inp146/inpress/sidebar'

export default defineConfig(
  withSidebar(
    {
      title: '我的文档',
      themeConfig: {
        search: { provider: 'local' }
      }
    },
    {
      documentRootPath: '/',
      useTitleFromFileHeading: true,
      sortMenusOrderNumericallyFromLink: true,
      collapsed: false,
      excludeByGlobPattern: ['drafts/**']
    }
  )
)
```

`documentRootPath` 相对于 `.vitepress` 所在的文档目录。使用上述配置时，新增 `guide/installation.md` 后，侧边栏会自动读取文件中第一个 `# 标题`。不需要填写文件名列表。

## 按路由分配侧边栏

如果每个顶层目录需要独立侧边栏，请传入配置数组。`scanStartPath` 指定要扫描的目录，`resolvePath` 指定匹配的 URL，`basePath` 为生成的链接添加前缀。

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import {
  withSidebar,
  type VitePressSidebarOptions
} from '@inp146/inpress/sidebar'

const shared = {
  documentRootPath: '/',
  useTitleFromFileHeading: true,
  sortMenusOrderNumericallyFromLink: true,
  collapsed: false
} satisfies VitePressSidebarOptions

export default defineConfig(
  withSidebar(
    {
      title: '我的文档'
    },
    [
      {
        ...shared,
        scanStartPath: 'guide',
        resolvePath: '/guide/',
        basePath: '/guide/'
      },
      {
        ...shared,
        scanStartPath: 'api',
        resolvePath: '/api/',
        basePath: '/api/'
      }
    ]
  )
)
```

访问 `/guide/*` 时只显示 `guide` 目录的文件，访问 `/api/*` 时只显示 `api` 目录的文件。

## 多语言分组侧边栏

`withSidebar` 只会写入顶层主题配置，无法直接填充 locale 内的 `themeConfig`。这种情况使用 `generateSidebar` 生成各语言分组：

```ts
// .vitepress/sidebar.ts
import type { DefaultTheme } from 'vitepress'
import { generateSidebar } from '@inp146/inpress/sidebar'

type Locale = 'en' | 'zh'

const sections = [
  { path: 'guide', labels: { en: 'Guide', zh: '使用指南' } },
  { path: 'config', labels: { en: 'Configuration', zh: '配置' } },
  { path: 'api', labels: { en: 'API', zh: 'API' } }
] as const

function createGroup(
  locale: Locale,
  section: (typeof sections)[number]
): DefaultTheme.SidebarItem {
  const localePath = locale === 'zh' ? 'zh/' : ''
  const scanStartPath = `${localePath}${section.path}`
  const base = `/${scanStartPath}/`
  const generated = generateSidebar([
    {
      documentRootPath: '/',
      scanStartPath,
      resolvePath: base,
      basePath: base,
      useTitleFromFileHeading: true,
      sortMenusOrderNumericallyFromLink: true
    }
  ])

  if (Array.isArray(generated) || !generated[base]) {
    throw new Error(`Failed to generate sidebar for ${base}`)
  }

  return {
    text: section.labels[locale],
    base: generated[base].base,
    items: generated[base].items,
    collapsed: false
  }
}

export function createSidebar(locale: Locale): DefaultTheme.SidebarItem[] {
  return sections.map((section) => createGroup(locale, section))
}
```

在主配置中使用生成的数组：

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { createSidebar } from './sidebar'

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: { sidebar: createSidebar('en') }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: { sidebar: createSidebar('zh') }
    }
  }
})
```

这样可以保留本地化的分组名称，各文件标题仍从 Markdown 中自动读取。`generateSidebar` 不会注入开发监听器；添加或删除文件后需要重启 VitePress，或在消费端自行添加监听器。

## 标题、排序与过滤

常用选项如下：

| 选项 | 作用 |
| --- | --- |
| `useTitleFromFileHeading` | 使用 Markdown 中第一个一级标题 |
| `useTitleFromFrontmatter` | 使用 frontmatter 的 `title` 字段 |
| `frontmatterTitleFieldName` | 更改 frontmatter 标题字段名 |
| `sortMenusOrderNumericallyFromLink` | 按文件链接自然排序，`2-intro` 会排在 `10-api` 之前 |
| `sortMenusByName` | 按实际显示的标题排序 |
| `sortMenusByFrontmatterOrder` | 按 frontmatter 中的数字 `order` 字段排序 |
| `excludeByGlobPattern` | 排除匹配的文件或目录 |
| `excludeFilesByFrontmatterFieldName` | 指定的 frontmatter 字段为真时排除文件 |
| `includeRootIndexFile` | 在菜单中包含文档根目录的 `index.md` |
| `includeFolderIndexFile` | 在菜单中包含子目录的 `index.md` |
| `useFolderLinkFromIndexFile` | 将目录项链接到其 `index.md` |
| `collapsed` | 允许折叠生成的分组 |
| `collapseDepth` | 折叠指定深度及更深的分组 |

使用 frontmatter 的示例：

```md
---
title: 安装
order: 20
excludeFromSidebar: false
---

# 安装
```

```ts
{
  useTitleFromFrontmatter: true,
  sortMenusByFrontmatterOrder: true,
  excludeFilesByFrontmatterFieldName: 'excludeFromSidebar'
}
```

一次只应启用一种排序方式。生成器遇到冲突的排序选项时会直接报错，不会隐式选择其中一种。目录链接、文件名前缀移除、日期排序、深度限制和符号链接等配置请查看[完整的上游选项文档](https://vitepress-sidebar.cdget.com/guide/options)。
