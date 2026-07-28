# Document metadata

- Type: `boolean | DocMetaConfig`
- Default: `undefined`

Adds a responsive breadcrumb and document statistics row above regular document pages.

```ts
export default defineConfig({
  themeConfig: {
    docMeta: {
      author: 'Documentation team',
      readingSpeed: 220,
      timeZone: 'Asia/Shanghai'
    }
  }
})
```

The breadcrumb is derived from the active VitePress sidebar. InPress uses the page title when the current document is not in the sidebar. Word count and reading time are calculated from the rendered article unless the page provides explicit values. When VitePress [`lastUpdated`](https://vitepress.dev/reference/site-config#lastupdated) is enabled, the displayed time comes from the document's latest Git commit.

Set per-page values in frontmatter:

```yaml
---
docMeta:
  author: Documentation team
  views: 732
---
```

Top-level `author`, `date`, `views`, `wordCount`, and `readingTime` fields are also recognized. An explicit `date` overrides the Git timestamp. The nested form avoids collisions with other plugins. Set `docMeta: false` in page frontmatter to hide the row for one document.

Use CSS variables to adapt the presentation:

```css
:root {
  --inpress-doc-meta-font-size: 14px;
  --inpress-doc-meta-item-gap: 18px;
  --inpress-doc-meta-icon-size: 17px;
}
```

See [`DocMetaConfig`](/api/doc-meta-config) for the configuration fields.
