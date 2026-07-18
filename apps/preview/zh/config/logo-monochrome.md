# logoMonochrome

- 类型：`boolean`
- 默认值：`false`

让导航栏 Logo 使用与旁边站点标题相同的颜色。

```ts
export default defineConfig({
  themeConfig: {
    logoMonochrome: true
  }
})
```

源 Logo 会作为蒙版使用，带透明背景的 SVG 或 PNG 通常效果最好。

