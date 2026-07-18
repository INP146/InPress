# 快速开始

可复用的 InPress 实现位于 `packages/inpress`。这个 VitePress 站点既是主题文档，也是在开发时直接引用主题源码的环境。

## 开发

在仓库根目录执行：

```sh
pnpm install
pnpm dev
```

文档站导入 `@inp146/inpress`，但 Vite 在开发时将其别名到 `packages/inpress/src/index.ts`。因此修改主题源码后无需发布或重新构建包，页面就会更新。

仓库检查还会移除 alias，并使用生成的 `dist` 包再次构建本站，从而独立验证包导出和 CSS 自动加载，而不是只验证源码联调路径。

## 主题入口

在 `.vitepress/theme/index.ts` 中使用 InPress 的[默认主题导出](/zh/api/default-theme)。

## 品牌颜色

主题包不包含固定品牌色。请在消费站点的 `themeConfig` 中配置 [`color`](/zh/config/color) 种子：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

其他主题 token 应定义在站点样式表中：

```ts
// .vitepress/theme/index.ts
import theme from '@inp146/inpress'
import './custom.css'

export default theme
```

```css
/* .vitepress/theme/custom.css */
:root {
  --inpress-marker-thickness: 10px;
}
```

## 链接下划线

文档正文链接默认不显示下划线。需要恢复 VitePress 样式时，请查看 [`hideLinkUnderline`](/zh/config/hide-link-underline)。
