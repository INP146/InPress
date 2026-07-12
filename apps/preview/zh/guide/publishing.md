# 发布

该包已配置为使用 `@inp146` npm scope。

构建主题包：

```sh
pnpm --filter @inp146/vitepress-theme build
```

发布包只包含 `dist`，导出主题入口和 `@inp146/vitepress-theme/style.css`。

消费方应与 VitePress 2 一同安装此包：

```ts
// .vitepress/theme/index.ts
import { createTheme } from '@inp146/vitepress-theme'

export default createTheme({
  cssVars: {
    root: {
      '--vp-c-brand-1': '#2563eb'
    }
  }
})
```
