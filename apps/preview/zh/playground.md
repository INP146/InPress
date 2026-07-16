<script setup>
import { ThemeConfigPlayground } from '@inp146/vitepress-theme/playground'
import { VPButton } from 'vitepress/theme'
</script>

# 主题调试面板

<ClientOnly>
  <ThemeConfigPlayground persist initially-open />
</ClientOnly>

使用面板调整本主题的颜色和交互功能，生成结果可直接放入 `defineConfig()`。

## 品牌元素

<div style="display: flex; gap: 12px; flex-wrap: wrap">
  <VPButton theme="brand" text="主要操作" href="https://github.com/vuejs/vitepress" />
  <VPButton theme="alt" text="次要操作" href="https://vitepress.dev/" />
</div>

主题中的 <mark>下划线记号笔</mark> 和 <mark class="highlight">笔刷高亮</mark> 会跟随当前品牌色。

## 平台链接

- <https://github.com/vuejs/vitepress>
- <https://gitlab.com/gitlab-org/gitlab>
- <https://www.npmjs.com/package/vitepress>
- [YouTube](https://www.youtube.com/)
- [哔哩哔哩](https://www.bilibili.com/)

## 内容预览

主题变量也会影响普通的[文档链接](https://vitepress.dev/)、`themeConfig` 等行内代码，以及导航栏中的深浅色切换。

```ts
export default defineConfig({
  themeConfig: {
    hideLinkUnderline: true,
    appearanceTransition: 'spread'
  }
})
```
