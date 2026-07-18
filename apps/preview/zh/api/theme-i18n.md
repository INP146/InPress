# themeI18n

- 导入路径：`@inp146/inpress/i18n`
- 类型：对象

提供 VitePress 默认主题界面文案的英文和简体中文 preset。

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

`/i18n` 子路径可安全地从 Node 环境中的 VitePress 配置导入。导航、文档正文和页脚文案仍由消费站点维护。

