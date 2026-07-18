# appearanceTransition

- 类型：`boolean | AppearanceTransitionMode`
- 默认值：`true`

控制浅色与深色模式的切换动画。

```ts
export default defineConfig({
  themeConfig: {
    appearanceTransition: 'fade'
  }
})
```

| 值 | 行为 |
| --- | --- |
| `true` 或 `'spread'` | 从外观切换按钮处扩散新主题。 |
| `'fade'` | 在两个主题之间渐变。 |
| `false` | 关闭动画。 |

不支持 View Transition API 的浏览器，以及偏好减少动态效果的用户，会保留 VitePress 原本的即时切换。具名模式见 [`AppearanceTransitionMode`](/zh/api/appearance-transition-mode)。

