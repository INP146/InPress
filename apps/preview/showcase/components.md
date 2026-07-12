# Components

This page ensures components registered from the theme package work in Markdown content.

## Theme badge

<ThemeBadge label="Rendered from the workspace theme" />

The component is also exported from the package for direct imports when a consumer needs local registration or composition.

## Provider links

Provider link icons are enabled by default. Disable them for a site, or choose a subset, through `themeConfig`:

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
  themeConfig: {
    inp146: {
      linkIcons: false,
      // Or: linkIcons: ['github', 'youtube']
    },
  },
});
```

- [YouTube](https://www.youtube.com/)
- [Bilibili](https://www.bilibili.com/)
- [GitHub](https://github.com/)
- [Twitter](https://x.com/)
- [Instagram](https://www.instagram.com/)
- [Threads](https://www.threads.net/)
