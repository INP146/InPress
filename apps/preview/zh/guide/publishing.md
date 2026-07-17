# 发布

该包已配置为使用 `@inp146` npm scope。

构建主题包：

```sh
pnpm --filter @inp146/inpress build
```

发布包只包含 `dist`。主题与 playground 入口会自动加载各自拆分后的 CSS，同时保留 `@inp146/inpress/style.css` 作为仅核心样式的导出。

消费方应与 VitePress 2 一同安装此包：

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

`color` 接受一个 `#RGB` 或 `#RRGGBB` 颜色种子，并生成浅色与深色模式的品牌和按钮 token。消费方需要在 CSS 中自行管理这些 token 时，请省略该配置。
