# Getting started

The reusable implementation lives in `packages/theme`. This VitePress site is intentionally only a preview host.

## Development

Run this command from the repository root:

```sh
pnpm install
pnpm dev
```

The preview imports `@inp146/vitepress-theme`, but Vite aliases it to `packages/theme/src/index.ts` during development. Changes to theme source therefore update the preview without publishing or rebuilding the package.

## Theme entry

`src/index.ts` extends `vitepress/theme`, which preserves the default theme while allowing you to add CSS, global components, app setup, or a wrapped layout.

## Brand tokens

The package has no fixed brand colors. Configure VitePress variables in the consuming site's theme entry:

```ts
import { createTheme } from '@inp146/vitepress-theme'

export default createTheme({
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
})
```

`cssVars` accepts any CSS custom property, so consumers can also tune exported component tokens such as `--theme-badge-radius` without forking the theme.

<ThemeBadge label="Registered by the theme" />
