# 主题契约

`@inp146/inpress` 是可复用包。文档站可以使用 InPress 的名称和视觉身份，但主题包本身必须保持中性，使其他 VitePress 站点无需移除隐含前提即可采用它。

## 包边界

不要在 `packages/inpress` 中加入站点名称、Logo、文案、外部链接、业务行为或品牌色。

文档正文、演示数据和本站视觉身份均放在 `apps/preview`。本站应以外部使用者相同的方式消费主题包。

## 视觉 token

颜色、字体、圆角和间距等消费方特有的值都必须以 CSS 自定义属性表达，每一个可变的视觉值必须能够被覆盖。

需要自动生成品牌色板时，请配置 [`themeConfig.color`](/zh/config/color)：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

InPress 会根据该种子生成浅色与深色模式的 VitePress 品牌和按钮 token。生成声明的选择器优先级高于普通站点 CSS；消费方需要完全手动管理色板时，请省略 `color`。

字体、圆角、间距及其他自定义 token 应放在消费站点的主题样式表中：

```css
:root {
  --inpress-sidebar-indent: 20px;
}
```

## 扩展 VitePress

优先使用 VitePress 的公开扩展点：CSS 变量、插槽、布局包装层和主题配置。只有当所需的结构或交互无法用这些 API 表达时，才 fork 或替换默认主题内部实现。

## 界面语言

主题包导出 [`themeI18n`](/zh/api/theme-i18n)，用于默认主题的通用界面文字。站点导航、文档正文和页脚文案仍保留在消费站点。
