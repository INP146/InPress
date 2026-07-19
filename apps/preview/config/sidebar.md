# Automatic sidebar

InPress includes `vitepress-sidebar` and exposes it through `@inp146/inpress/sidebar`. Consumers do not need to install another package.

## Choose an API

| API | Use it when | Development updates |
| --- | --- | --- |
| `withSidebar` | VitePress can own the complete top-level `themeConfig.sidebar` | Restarts VitePress after Markdown files are added or deleted |
| `generateSidebar` | Sidebar data must be composed manually or placed inside locale-specific `themeConfig` objects | Regenerated when the VitePress config is loaded |

`withSidebar` replaces an existing top-level `themeConfig.sidebar`. Use `generateSidebar` when manual and generated groups need to coexist.

## Site-wide sidebar

This is the recommended configuration for a site that shows the same sidebar on every documentation page:

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withSidebar } from '@inp146/inpress/sidebar'

export default defineConfig(
  withSidebar(
    {
      title: 'My documentation',
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

`documentRootPath` is relative to the directory containing `.vitepress`. With the configuration above, adding `guide/installation.md` automatically creates a link from its first `# Heading`. No filename list is required.

## Route-specific sidebars

Pass an array when each top-level directory should have its own sidebar. `scanStartPath` selects the directory, `resolvePath` selects the matching URL, and `basePath` prefixes the generated links.

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
      title: 'My documentation'
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

On `/guide/*`, this displays only files below `guide`. On `/api/*`, it displays only files below `api`.

## Localized grouped sidebar

Locale-specific VitePress configuration cannot be populated by `withSidebar`, because it only writes the top-level theme configuration. Use `generateSidebar` to create each localized group instead:

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

Use the generated arrays in the main configuration:

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

This approach preserves localized group labels while file titles still come from each Markdown document. `generateSidebar` does not install a development watcher; restart VitePress after adding or deleting files, or add a watcher in the consuming site.

## Titles, ordering, and filtering

The most commonly used options are:

| Option | Effect |
| --- | --- |
| `useTitleFromFileHeading` | Uses the first level-one Markdown heading |
| `useTitleFromFrontmatter` | Uses the frontmatter `title` field |
| `frontmatterTitleFieldName` | Changes the frontmatter title field name |
| `sortMenusOrderNumericallyFromLink` | Sorts naturally by file link, so `2-intro` precedes `10-api` |
| `sortMenusByName` | Sorts by the displayed title |
| `sortMenusByFrontmatterOrder` | Sorts by the numeric frontmatter `order` field |
| `excludeByGlobPattern` | Excludes matching files or directories |
| `excludeFilesByFrontmatterFieldName` | Excludes a file when the specified frontmatter field is truthy |
| `includeRootIndexFile` | Includes the documentation-root `index.md` |
| `includeFolderIndexFile` | Includes nested `index.md` files as menu items |
| `useFolderLinkFromIndexFile` | Links a folder item to its `index.md` |
| `collapsed` | Makes generated groups collapsible |
| `collapseDepth` | Collapses groups at or below the specified depth |

Example using frontmatter:

```md
---
title: Installation
order: 20
excludeFromSidebar: false
---

# Installation
```

```ts
{
  useTitleFromFrontmatter: true,
  sortMenusByFrontmatterOrder: true,
  excludeFilesByFrontmatterFieldName: 'excludeFromSidebar'
}
```

Only enable one sorting strategy at a time. The generator rejects conflicting sorting options instead of choosing one implicitly. See the [complete upstream option reference](https://vitepress-sidebar.cdget.com/guide/options) for folder links, filename-prefix removal, date sorting, depth limits, and symlink handling.
