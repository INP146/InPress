# Getting started

The reusable InPress implementation lives in `packages/inpress`. This VitePress site is both the theme's documentation and its source-linked development environment.

## Development

Run this command from the repository root:

```sh
pnpm install
pnpm dev
```

The documentation site imports `@inp146/inpress`, but Vite aliases it to `packages/inpress/src/index.ts` during development. Changes to theme source therefore update the site without publishing or rebuilding the package.

The repository check also builds this site against the generated `dist` package without aliases, so package exports and automatic CSS loading are verified separately from the source-linked development path.

## Theme entry

Use InPress's [default theme export](/api/default-theme) from `.vitepress/theme/index.ts`.

## Brand color

The package has no fixed brand colors. Configure the [`color`](/config/color) seed in the consuming site's `themeConfig`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

Define other theme tokens in a site stylesheet:

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

Document links have no underline by default. See [`hideLinkUnderline`](/config/hide-link-underline) to restore the VitePress style.
