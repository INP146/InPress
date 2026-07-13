# Theme contract

`@inp146/vitepress-theme` is a reusable package. The documentation site may carry this project's identity, but the package must remain neutral so another VitePress site can adopt it without removing embedded assumptions.

## Package boundary

Do not add site names, logos, copy, external links, business behavior, or brand colors to `packages/theme`.

Keep documentation prose, demo data, and this site's visual identity under `apps/preview`. The site consumes the package in the same way an external user would.

## Visual tokens

Consumer-specific values, including color, typography, radius, and spacing, must be expressed as CSS custom properties. Every variable visual value must stay overridable.

Configure tokens in the consuming site's `themeConfig`. Use `root` for shared values and `dark` for dark-mode overrides:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    cssVars: {
      root: {
        '--vp-c-brand-1': '#2563eb'
      },
      dark: {
        '--vp-c-brand-1': '#60a5fa'
      }
    }
  }
})
```

## Extending VitePress

Prefer the documented VitePress extension points: CSS variables, slots, a wrapped layout, and theme configuration. Fork or replace default-theme internals only when a required markup or interaction cannot be expressed through those APIs.

## Interface language

The package exports `themeI18n` for default-theme interface strings. Import and spread the matching preset in the VitePress configuration; keep site navigation, documentation, and footer copy in the consuming site:

```ts
import { defineConfig } from 'vitepress'
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
