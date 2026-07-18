# linkIconProviders

- 导入路径：`@inp146/inpress`
- 类型：只读数组

包含 [`linkIcons`](/zh/config/link-icons) 支持的全部平台标识符。

```ts
import { linkIconProviders } from '@inp146/inpress'
```

该值使用 `as const` 声明，因此也可用于构建带类型的控件或校验列表。

```ts
[
  'github', 'gitlab', 'npm', 'discord', 'telegram', 'linkedin',
  'reddit', 'twitch', 'tiktok', 'weibo', 'xiaohongshu', 'zhihu',
  'juejin', 'x', 'instagram', 'threads', 'youtube', 'bilibili'
]
```

