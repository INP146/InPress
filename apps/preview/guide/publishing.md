# Publishing

The package is configured for the `@inp146` npm scope.

Build the package:

```sh
pnpm --filter @inp146/inpress build
```

The published package contains only `dist`. It exports the theme entry point and `@inp146/inpress/style.css`.

Consumers install the package alongside VitePress 2:

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    cssVars: {
      root: {
        '--vp-c-brand-1': '#2563eb'
      }
    }
  }
})
```
