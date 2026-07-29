# AppearanceTransitionMode

- 导入路径：`@inp146/inpress`
- 类型：TypeScript type

定义 [`appearanceTransition`](/zh/config/appearance-transition) 接受的具名动画模式。

```ts
type AppearanceTransitionMode = 'spread' | 'spread-light' | 'fade'
```

`'spread'` 对深色主题层执行扩散动画，`'spread-light'` 对浅色主题层执行扩散动画。配置还接受布尔值：`true` 等同于 `'spread'`，`false` 关闭动画。
