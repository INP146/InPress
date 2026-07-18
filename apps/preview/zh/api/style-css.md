# style.css

- 导入路径：`@inp146/inpress/style.css`
- 类型：CSS 子路径

只加载 InPress 编译后的核心与组件样式，不安装默认主题导出的布局行为。

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import '@inp146/inpress/style.css'

export default DefaultTheme
```

使用[默认主题](/zh/api/default-theme)时不需要重复导入，因为样式会自动加载。只有自定义主题入口需要 InPress 样式、但不需要其布局行为时，才使用此 CSS 子路径。

