# LinkIconProvider

- 导入路径：`@inp146/inpress`
- 类型：TypeScript union

表示 [`linkIcons`](/zh/config/link-icons) 支持的单个平台。

```ts
type LinkIconProvider =
  | 'github'
  | 'gitlab'
  | 'npm'
  | 'discord'
  | 'telegram'
  | 'linkedin'
  | 'reddit'
  | 'twitch'
  | 'tiktok'
  | 'weibo'
  | 'xiaohongshu'
  | 'zhihu'
  | 'juejin'
  | 'x'
  | 'instagram'
  | 'threads'
  | 'youtube'
  | 'bilibili'
```

该联合类型派生自 [`linkIconProviders`](/zh/api/link-icon-providers)，因此运行时列表和 TypeScript 类型会保持同步。

