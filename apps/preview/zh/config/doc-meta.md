# 文档信息栏

- 类型：`boolean | DocMetaConfig`
- 默认值：`undefined`

在普通文档页上方添加响应式面包屑和文章统计信息。

```ts
export default defineConfig({
  themeConfig: {
    docMeta: {
      author: "文档团队",
      readingSpeed: 220,
      timeZone: "Asia/Shanghai",
    },
  },
});
```

面包屑根据当前生效的 VitePress sidebar 自动生成。当前文档不在 sidebar 中时，InPress 会使用页面标题。未在页面中提供明确数值时，字数和阅读时长会根据渲染后的正文自动计算。启用 VitePress [`lastUpdated`](https://vitepress.dev/zh/reference/site-config#lastupdated) 后，页面时间来自当前 Markdown 文件的最后一次 Git 提交。

可以在页面 frontmatter 中设置数据：

```yaml
---
docMeta:
  author: 文档团队
  views: 732
---
```

同时兼容顶层的 `author`、`date`、`views`、`wordCount` 和 `readingTime` 字段。显式填写的 `date` 会覆盖 Git 时间。推荐使用嵌套形式以避免和其他插件冲突。在单页 frontmatter 中设置 `docMeta: false` 可以隐藏信息栏。

可以通过 CSS 变量调整显示效果：

```css
:root {
  --inpress-doc-meta-font-size: 14px;
  --inpress-doc-meta-item-gap: 18px;
  --inpress-doc-meta-icon-size: 17px;
}
```

配置字段见 [`DocMetaConfig`](/zh/api/doc-meta-config)。
