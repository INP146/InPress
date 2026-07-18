# color

- Type: [`ThemeColor`](/api/theme-color)
- Default: `undefined`

Sets the hexadecimal seed used to generate accessible brand and button tokens for light and dark mode.

```ts
export default defineConfig({
  themeConfig: {
    color: '#0f766e'
  }
})
```

Only `#RGB` and `#RRGGBB` values are accepted. Generated declarations have higher selector specificity than ordinary site CSS. Omit `color` when the consuming site needs to manage VitePress brand and button tokens manually.

