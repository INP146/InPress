# favicon

- Type: [`FaviconConfig`](/api/favicon-config)
- Default: `true`

Uses the navigation logo as the favicon by default. Set it to `false` to disable the managed favicon, or provide a separate VitePress `ThemeableImage`.

```ts
export default defineConfig({
  themeConfig: {
    favicon: {
      light: '/favicon-light.svg',
      dark: '/favicon-dark.svg'
    }
  }
})
```

An explicit favicon in VitePress `head` takes precedence.

## Geometry

Adjust a theme-managed favicon in the consuming site's stylesheet:

```css
:root {
  --inpress-favicon-size: 100%;
  --inpress-favicon-offset-x: 0%;
  --inpress-favicon-offset-y: 0%;
}
```

The values are percentages of the favicon viewport. `size` scales around the center; the offsets move the image without changing its size. These variables do not affect a favicon declared in `head`.

