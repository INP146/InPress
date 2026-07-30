# routeProgress

- 类型：`boolean`
- 默认值：`true`

客户端路由加载期间，在视口顶部显示使用品牌色的进度条。

```ts
export default defineConfig({
  themeConfig: {
    routeProgress: false
  }
})
```

设为 `false` 可移除进度条。可在消费站点的主题样式表中调整其外观：

```css
:root {
  --inpress-route-progress-color: var(--vp-c-brand-1);
  --inpress-route-progress-height: 3px;
}
```

同页锚点跳转不会显示进度条；动画也会遵循用户的“减少动态效果”偏好。
