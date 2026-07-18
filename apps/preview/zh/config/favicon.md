# favicon

- 类型：[`FaviconConfig`](/zh/api/favicon-config)
- 默认值：`true`

默认使用导航栏 Logo 作为 favicon。设为 `false` 可关闭主题管理的 favicon，也可以传入独立的 VitePress `ThemeableImage`。

```ts
export default defineConfig({
  themeConfig: {
    favicon: {
      light: '/favicon-light.svg',
      dark: '/favicon-dark.svg'
    }
  }
})
```

VitePress `head` 中显式配置的 favicon 优先。

## 几何设置

在消费站点的样式表中调整主题管理的 favicon：

```css
:root {
  --inpress-favicon-size: 100%;
  --inpress-favicon-offset-x: 0%;
  --inpress-favicon-offset-y: 0%;
}
```

数值是 favicon 视口的百分比。`size` 以中心为基准缩放，两个 offset 只移动图像，不改变尺寸。这些变量不会影响 `head` 中声明的 favicon。

