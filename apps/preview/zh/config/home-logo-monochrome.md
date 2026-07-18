# homeLogoMonochrome

- 类型：`boolean`
- 默认值：`false`

将主页 Hero 图片作为单色蒙版，并使用当前品牌色 token 着色。

```ts
export default defineConfig({
  themeConfig: {
    homeLogoMonochrome: true
  }
})
```

此设置作用于 VitePress 默认主页 Hero 图片，适合带透明背景的 Logo 素材。

