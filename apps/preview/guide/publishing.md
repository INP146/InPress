# Publishing

The package is configured for the `@inp146` npm scope.

Build the package:

```sh
pnpm --filter @inp146/vitepress-theme build
```

The published package contains only `dist`. It exports the theme entry point and `@inp146/vitepress-theme/style.css`.

Consumers install the package alongside VitePress 2:

```ts
// .vitepress/theme/index.ts
import { createTheme } from '@inp146/vitepress-theme'

export default createTheme({
  cssVars: {
    root: {
      '--vp-c-brand-1': '#2563eb'
    }
  }
})
```
