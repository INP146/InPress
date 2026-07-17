# Getting started

The reusable InPress implementation lives in `packages/inpress`. This VitePress site is both the theme's documentation and its source-linked development environment.

## Development

Run this command from the repository root:

```sh
pnpm install
pnpm dev
```

The documentation site imports `@inp146/inpress`, but Vite aliases it to `packages/inpress/src/index.ts` during development. Changes to theme source therefore update the site without publishing or rebuilding the package.

## Theme entry

`src/index.ts` extends `vitepress/theme`, which preserves the default theme while allowing CSS, app setup, or a wrapped layout.

## Brand color

The package has no fixed brand colors. Provide one `#RGB` or `#RRGGBB` seed in the consuming site's `themeConfig`; InPress derives the light and dark brand and button tokens from it:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

The generated declarations have higher selector specificity than ordinary site CSS. Omit `color` when the site must manage its brand palette manually. Define other theme tokens in a site stylesheet:

```ts
// .vitepress/theme/index.ts
import theme from '@inp146/inpress'
import './custom.css'

export default theme
```

```css
/* .vitepress/theme/custom.css */
:root {
  --inpress-marker-thickness: 10px;
}
```

## Link underlines

Document links have no underline by default. Restore the VitePress underline with:

```ts
export default defineConfig({
  themeConfig: {
    hideLinkUnderline: false
  }
})
```
