# VitePress theme workspace

This repository treats the VitePress theme as the product and `apps/preview` as both its documentation site and source-linked development environment.

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

## Structure

- `packages/theme`: independently publishable VitePress 2 theme package.
- `apps/preview`: VitePress documentation site used to develop and validate the theme.

The documentation site aliases the package name to `packages/theme/src/index.ts`; package consumers resolve the built `dist` entry instead. Brand colors and other CSS tokens are configured by each consumer through `createTheme()`, not embedded in the package. Write guides, API notes, and design decisions in `apps/preview`.

## Theme Contract

`packages/theme` is a reusable product, not this repository's branded website. Keep the following boundary intact:

- Do not put site names, logos, copy, links, business behavior, or brand colors in the theme package.
- Put every consumer-specific visual token, including color, typography, radius, and spacing, behind CSS custom properties. A component may have a structural fallback only when the property remains overridable.
- Configure tokens in the consuming site's `.vitepress/theme/index.ts` with `createTheme()`. Use `root` for shared tokens and `dark` for dark-mode overrides.
- Keep demonstration content and all example token values under `apps/preview`; it is a consumer of the package, not part of the package.
- Extend the public VitePress theme API first. Fork or replace default-theme internals only when a required interaction or markup change cannot be expressed through CSS, slots, a layout wrapper, or documented configuration.

```ts
import { createTheme } from '@inp146/vitepress-theme'

export default createTheme({
  cssVars: {
    root: {
      '--vp-c-brand-1': '#2563eb',
      '--theme-badge-radius': '6px'
    },
    dark: {
      '--vp-c-brand-1': '#60a5fa'
    }
  }
})
```
