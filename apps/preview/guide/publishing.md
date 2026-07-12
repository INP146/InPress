# Publishing

Before publishing, replace `@your-scope/vitepress-theme` in the workspace manifests with the npm scope you own.

Build the package:

```sh
pnpm --filter @your-scope/vitepress-theme build
```

The published package contains only `dist`. It exports the theme entry point and `@your-scope/vitepress-theme/style.css`.

Consumers install the package alongside VitePress 2:

```ts
// .vitepress/theme/index.ts
import theme from '@your-scope/vitepress-theme'

export default theme
```
