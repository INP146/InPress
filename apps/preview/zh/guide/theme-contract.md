# 主题契约

`@inp146/vitepress-theme` 是可复用包。文档站可以使用本项目的名称和视觉身份，但主题包本身必须保持中性，使其他 VitePress 站点无需移除隐含前提即可采用它。

## 包边界

不要在 `packages/theme` 中加入站点名称、Logo、文案、外部链接、业务行为或品牌色。

文档正文、演示数据和本站视觉身份均放在 `apps/preview`。本站应以外部使用者相同的方式消费主题包。

## 视觉 token

颜色、字体、圆角和间距等消费方特有的值都必须以 CSS 自定义属性表达，每一个可变的视觉值必须能够被覆盖。

在消费站点的 `themeConfig` 中配置 token。`root` 用于共享值，`dark` 用于深色模式覆盖：

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

## 扩展 VitePress

优先使用 VitePress 的公开扩展点：CSS 变量、插槽、布局包装层和主题配置。只有当所需的结构或交互无法用这些 API 表达时，才 fork 或替换默认主题内部实现。

## 界面语言

主题包导出 `themeI18n`，用于默认主题的通用界面文字。在 VitePress 配置中导入并展开相应 preset；站点导航、文档正文和页脚文案仍保留在消费站点：

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
