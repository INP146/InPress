# 默认主题

- 导入路径：`@inp146/inpress`
- 类型：默认导出

默认导出扩展 VitePress 默认主题，并安装 InPress 的布局行为和样式。

```ts
// .vitepress/theme/index.ts
import theme from '@inp146/inpress'

export default theme
```

主题入口会自动加载核心与组件样式。只需要样式表的消费方也可以手动导入 `@inp146/inpress/style.css` 子路径。

