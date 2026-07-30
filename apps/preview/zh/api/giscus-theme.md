# GiscusTheme

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

为站点的浅色与深色外观分别提供 Giscus 主题。

```ts
interface GiscusTheme {
  light: string
  dark: string
}
```

每个值都可以是 Giscus 内置主题名称、HTTPS URL，或由 InPress 处理的站点根相对 CSS 路径。

特殊字符串 `'inpress'` 会根据页面当前计算出的 VitePress CSS 自定义属性生成 data theme。它可以跟随外观切换和运行时色板更新，无需在另一份样式表中重复颜色值。

```ts
const theme: GiscusTheme = {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

[`GiscusConfig`](/zh/api/giscus-config) 也接受单个字符串，但它不会随 VitePress 外观切换。`preferred_color_scheme` 跟随操作系统，而不是 VitePress 的切换状态。
