# InPress

This repository treats InPress as the product and `apps/preview` as both its documentation site and source-linked development environment.

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

## Structure

- `packages/inpress`: independently publishable VitePress 2 theme package.
- `apps/preview`: VitePress documentation site used to develop and validate the theme.

The documentation site aliases the package name to `packages/inpress/src/index.ts`; package consumers resolve the built `dist` entry instead. Each consumer may provide a brand-color seed through `themeConfig.color`; other visual tokens belong in the consuming site's CSS. Write guides, API notes, and design decisions in `apps/preview`.

## Theme Contract

`packages/inpress` is a reusable product, not this repository's branded website. Keep the following boundary intact:

- Do not put site names, logos, copy, links, business behavior, or brand colors in the theme package.
- Put every consumer-specific visual token, including color, typography, radius, and spacing, behind CSS custom properties. A component may have a structural fallback only when the property remains overridable.
- Configure the generated brand palette with a single `themeConfig.color` seed. Put typography, radius, spacing, and manual token overrides in the consuming site's theme CSS.
- Generated color declarations have higher specificity than ordinary CSS. Omit `color` when a site needs to manage its palette entirely through CSS.
- Keep demonstration content and all example token values under `apps/preview`; it is a consumer of the package, not part of the package.
- Extend the public VitePress theme API first. Fork or replace default-theme internals only when a required interaction or markup change cannot be expressed through CSS, slots, a layout wrapper, or documented configuration.

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```
