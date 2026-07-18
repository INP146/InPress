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

```ts
const theme: GiscusTheme = {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

[`GiscusConfig`](/zh/api/giscus-config) 也接受单个字符串，但它不会随 VitePress 外观切换。`preferred_color_scheme` 跟随操作系统，而不是 VitePress 的切换状态。

