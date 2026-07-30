# GiscusTheme

- Import: `@inp146/inpress`
- Kind: TypeScript interface

Provides separate Giscus themes for the site's light and dark appearance.

```ts
interface GiscusTheme {
  light: string
  dark: string
}
```

Each value can be a built-in Giscus theme name, an HTTPS URL, or a root-relative CSS path handled by InPress.

The special string `'inpress'` generates a data theme from the VitePress CSS custom properties currently computed on the page. It follows appearance changes and runtime palette updates without duplicating color values in a separate stylesheet.

```ts
const theme: GiscusTheme = {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

A single string is also accepted by [`GiscusConfig`](/api/giscus-config), but it does not switch with VitePress appearance. `preferred_color_scheme` follows the operating system rather than VitePress's switch.
