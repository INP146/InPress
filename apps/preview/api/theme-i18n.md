# themeI18n

- Import: `@inp146/inpress/i18n`
- Kind: object

Provides English and Simplified Chinese presets for VitePress default-theme interface strings.

```ts
import { defineConfig } from 'vitepress'
import { themeI18n } from '@inp146/inpress/i18n'

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: { ...themeI18n.en }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: { ...themeI18n.zh }
    }
  }
})
```

The `/i18n` subpath is Node-safe and can be imported from VitePress configuration. Navigation, documentation, and footer copy remain the responsibility of the consuming site.

