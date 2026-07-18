# GiscusMapping

- 导入路径：`@inp146/inpress`
- 类型：TypeScript union

列出 [`GiscusConfig`](/zh/api/giscus-config) 接受的页面与讨论映射方式。

```ts
type GiscusMapping =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'
```

请使用 [giscus.app](https://giscus.app) 中选择的相同模式。`pathname` 按页面路径映射，`url` 使用完整页面 URL；`specific` 和 `number` 需要对应的 `term`。

