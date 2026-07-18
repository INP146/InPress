# logoMonochrome

- Type: `boolean`
- Default: `false`

Renders the navigation logo in the same color as the adjacent site title.

```ts
export default defineConfig({
  themeConfig: {
    logoMonochrome: true
  }
})
```

The source logo is used as a mask, so transparent SVG or PNG assets produce the clearest result.

