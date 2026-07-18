# playground

- Type: `boolean | ThemePlaygroundConfig`
- Default: `false`

Controls local-storage persistence for [`ThemeConfigPlayground`](/api/theme-config-playground).

```ts
export default defineConfig({
  themeConfig: {
    playground: true
  }
})
```

`true` uses InPress's default storage key. Provide a custom key when multiple sites or playgrounds share an origin:

```ts
themeConfig: {
  playground: {
    storageKey: 'my-site-theme'
  }
}
```

When omitted or `false`, playground edits still apply to the current SPA session but are lost after a reload. See [`ThemePlaygroundConfig`](/api/theme-playground-config).

