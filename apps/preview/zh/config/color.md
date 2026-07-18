# color

- 类型：[`ThemeColor`](/zh/api/theme-color)
- 默认值：`undefined`

设置十六进制颜色种子，用于生成在浅色与深色模式下均具备可读对比度的品牌和按钮 token。

```ts
export default defineConfig({
  themeConfig: {
    color: '#0f766e'
  }
})
```

仅接受 `#RGB` 和 `#RRGGBB`。生成声明的选择器优先级高于普通站点 CSS；消费站点需要手动管理 VitePress 品牌与按钮 token 时，请省略 `color`。

