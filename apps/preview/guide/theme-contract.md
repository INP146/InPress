# Theme contract

`@inp146/inpress` is a reusable package. The documentation site may carry InPress's identity, but the package must remain neutral so another VitePress site can adopt it without removing embedded assumptions.

## Package boundary

Do not add site names, logos, copy, external links, business behavior, or brand colors to `packages/inpress`.

Keep documentation prose, demo data, and this site's visual identity under `apps/preview`. The site consumes the package in the same way an external user would.

## Visual tokens

Consumer-specific values, including color, typography, radius, and spacing, must be expressed as CSS custom properties. Every variable visual value must stay overridable.

For a generated brand palette, configure [`themeConfig.color`](/config/color):

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#2563eb'
  }
})
```

InPress derives the light and dark VitePress brand and button tokens from this seed. The generated declarations have higher selector specificity than ordinary site CSS. Omit `color` when a consumer needs to manage the palette manually.

Typography, radius, spacing, and other custom tokens belong in the consuming site's theme stylesheet:

```css
:root {
  --inpress-sidebar-indent: 20px;
}
```

## Extending VitePress

Prefer the documented VitePress extension points: CSS variables, slots, a wrapped layout, and theme configuration. Fork or replace default-theme internals only when a required markup or interaction cannot be expressed through those APIs.

## Interface language

The package exports [`themeI18n`](/api/theme-i18n) for default-theme interface strings. Site navigation, documentation, and footer copy remain in the consuming site.
