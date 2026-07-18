# AppearanceTransitionMode

- 导入路径：`@inp146/inpress`
- 类型：TypeScript type

定义 [`appearanceTransition`](/zh/config/appearance-transition) 接受的具名动画模式。

```ts
type AppearanceTransitionMode = 'spread' | 'fade'
```

配置还接受布尔值：`true` 等同于 `'spread'`，`false` 关闭动画。

