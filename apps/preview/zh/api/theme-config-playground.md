# ThemeConfigPlayground

- 导入路径：`@inp146/inpress/playground`
- 类型：Vue 组件

在页面内渲染当前站点的 InPress 设置编辑器。

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/inpress/playground'
</script>

<template>
  <ThemeConfigPlayground />
</template>
```

组件不接收 props。修改会更新共享的运行时主题状态，因此品牌颜色、平台链接、链接行为、外观切换动画和 Giscus 显示状态会作用于当前 SPA 全站。

组件不会修改 VitePress 导航、侧边栏数据、任意 CSS 自定义属性或 Analytics 设置。只有站点已经提供有效的 [`giscus`](/zh/config/giscus) 配置时才能启用 Giscus。

持久化由 [`playground`](/zh/config/playground) 主题设置控制。未启用持久化时，修改会在刷新页面后丢失。

