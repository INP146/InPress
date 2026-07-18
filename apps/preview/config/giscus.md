# giscus

- Type: `GiscusConfig | false`
- Default: `undefined`

Adds Giscus comments below each document page.

```ts
export default defineConfig({
  themeConfig: {
    giscus: {
      repo: 'owner/repository',
      repoId: 'R_kgDO...',
      category: 'Announcements',
      categoryId: 'DIC_kwDO...',
      mapping: 'url',
      inputPosition: 'bottom',
      lang: 'en'
    }
  }
})
```

Before configuring InPress, enable Discussions for the repository, install the [Giscus GitHub App](https://github.com/apps/giscus), and generate the repository values at [giscus.app](https://giscus.app).

The widget follows VitePress light and dark mode by default. A custom theme can use an HTTPS URL or a root-relative CSS path:

```ts
theme: {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

Giscus loads custom CSS from an iframe, so the response must allow `https://giscus.app` through CORS. HTTPS iframes cannot load plain HTTP stylesheets; local development falls back to the matching built-in theme.

Set `giscus: false` in page frontmatter to hide comments for one document. See [`GiscusConfig`](/api/giscus-config) for every field.

