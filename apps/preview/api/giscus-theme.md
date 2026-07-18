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

```ts
const theme: GiscusTheme = {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

A single string is also accepted by [`GiscusConfig`](/api/giscus-config), but it does not switch with VitePress appearance. `preferred_color_scheme` follows the operating system rather than VitePress's switch.

