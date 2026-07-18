# FaviconConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript type

描述 [`favicon`](/zh/config/favicon) 设置。

```ts
import type { DefaultTheme } from 'vitepress/theme'

type FaviconConfig = boolean | DefaultTheme.ThemeableImage
```

`true` 使用导航栏 Logo，`false` 关闭 InPress favicon 管理，`ThemeableImage` 则提供独立字符串或浅色/深色图片源。

