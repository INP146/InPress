# Getting started

The reusable implementation lives in `packages/theme`. This VitePress site is both the theme's documentation and its source-linked development environment.

## Development

Run this command from the repository root:

```sh
pnpm install
pnpm dev
```

The documentation site imports `@inp146/vitepress-theme`, but Vite aliases it to `packages/theme/src/index.ts` during development. Changes to theme source therefore update the site without publishing or rebuilding the package.

## Theme entry

`src/index.ts` extends `vitepress/theme`, which preserves the default theme while allowing CSS, app setup, or a wrapped layout.

## Brand tokens

The package has no fixed brand colors. Configure VitePress variables directly in the consuming site's `themeConfig`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    cssVars: {
      root: {
        '--vp-c-brand-1': '#2563eb',
        '--vp-c-brand-2': '#3b82f6',
        '--vp-c-brand-3': '#60a5fa'
      },
      dark: {
        '--vp-c-brand-1': '#60a5fa'
      }
    }
  }
})
```

`cssVars` accepts any CSS custom property, including VitePress tokens and theme tokens documented by this package.

## Link underlines

Document links have no underline by default. Restore the VitePress underline with:

```ts
export default defineConfig({
  themeConfig: {
    hideLinkUnderline: false
  }
})
```
