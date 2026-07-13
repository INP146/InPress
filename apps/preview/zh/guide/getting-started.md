# 快速开始

可复用主题实现位于 `packages/theme`。这个 VitePress 站点既是主题文档，也是在开发时直接引用主题源码的环境。

## 开发

在仓库根目录执行：

```sh
pnpm install
pnpm dev
```

文档站导入 `@inp146/vitepress-theme`，但 Vite 在开发时将其别名到 `packages/theme/src/index.ts`。因此修改主题源码后无需发布或重新构建包，页面就会更新。

## 主题入口

`src/index.ts` 扩展 `vitepress/theme`，保留默认主题，同时允许添加 CSS、全局组件、应用初始化逻辑或布局包装层。

## 品牌 token

主题包不包含固定品牌色。请在消费站点的 `themeConfig.inp146` 中配置 VitePress 变量：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    inp146: {
      cssVars: {
        root: {
          '--vp-c-brand-1': '#2563eb',
          '--vp-c-brand-2': '#3b82f6',
          '--vp-c-brand-3': '#60a5fa'
        },
        dark: {
          '--vp-c-brand-1': '#60a5fa'
        }
      }
    }
  }
})
```

`cssVars` 接受任意 CSS 自定义属性，因此消费方也可以在不 fork 主题的前提下调整 `--theme-badge-radius` 等组件 token。

## 链接下划线

文档正文链接默认不显示下划线。需要恢复 VitePress 默认下划线时，配置：

```ts
export default defineConfig({
  themeConfig: {
    inp146: {
      hideLinkUnderline: false
    }
  }
})
```

<ThemeBadge label="由主题注册的组件" />
