# InPress

InPress is a reusable theme that extends the VitePress default theme with
brand-color generation, appearance transitions, link enhancements, analytics,
Giscus comments, and optional configuration tools.

## Install

After configuring the `@inp146` scope for GitHub Packages, install InPress and
its peer dependencies:

```sh
pnpm add @inp146/inpress vitepress vue
```

## Use

Create `.vitepress/theme/index.ts`:

```ts
import theme from '@inp146/inpress'

export default theme
```

Configure InPress through the standard VitePress theme config:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

The main theme entry loads its styles automatically. The package also exposes
`@inp146/inpress/i18n`, `@inp146/inpress/playground`,
`@inp146/inpress/sidebar`, and `@inp146/inpress/style.css`.

## License

[MIT](./LICENSE)
