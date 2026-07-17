# Publishing

The package is configured for the `@inp146` npm scope.

Build the package:

```sh
pnpm --filter @inp146/inpress build
```

The published package contains only `dist`. The theme and playground entries load their own split CSS automatically; `@inp146/inpress/style.css` remains available as a core CSS-only export.

Consumers install the package alongside VitePress 2:

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

`color` accepts one `#RGB` or `#RRGGBB` seed and generates the light and dark brand and button tokens. Omit it when the consumer manages those tokens in CSS.
