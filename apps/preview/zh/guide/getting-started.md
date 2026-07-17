# 快速开始

可复用的 InPress 实现位于 `packages/inpress`。这个 VitePress 站点既是主题文档，也是在开发时直接引用主题源码的环境。

## 开发

在仓库根目录执行：

```sh
pnpm install
pnpm dev
```

文档站导入 `@inp146/inpress`，但 Vite 在开发时将其别名到 `packages/inpress/src/index.ts`。因此修改主题源码后无需发布或重新构建包，页面就会更新。

## 主题入口

`src/index.ts` 扩展 `vitepress/theme`，保留默认主题，同时允许添加 CSS、应用初始化逻辑或布局包装层。

## 品牌颜色

主题包不包含固定品牌色。请在消费站点的 `themeConfig` 中提供一个 `#RGB` 或 `#RRGGBB` 颜色种子，InPress 会据此生成浅色与深色模式的品牌和按钮 token：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

生成的颜色声明具有高于普通站点 CSS 的选择器优先级。需要完全手动管理品牌色板时，请省略 `color`。其他主题 token 应定义在站点样式表中：

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

文档正文链接默认不显示下划线。需要恢复 VitePress 默认下划线时，配置：

```ts
export default defineConfig({
  themeConfig: {
    hideLinkUnderline: false
  }
})
```
