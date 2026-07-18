# linkIconProviders

- Import: `@inp146/inpress`
- Kind: readonly array

Contains every provider identifier supported by [`linkIcons`](/config/link-icons).

```ts
import { linkIconProviders } from '@inp146/inpress'
```

The value is declared with `as const`, so it can also be used to build typed controls or validation lists.

```ts
[
  'github', 'gitlab', 'npm', 'discord', 'telegram', 'linkedin',
  'reddit', 'twitch', 'tiktok', 'weibo', 'xiaohongshu', 'zhihu',
  'juejin', 'x', 'instagram', 'threads', 'youtube', 'bilibili'
]
```

