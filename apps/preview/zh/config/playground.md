# playground

- 类型：`boolean | ThemePlaygroundConfig`
- 默认值：`false`

控制 [`ThemeConfigPlayground`](/zh/api/theme-config-playground) 的本地存储持久化。

```ts
export default defineConfig({
  themeConfig: {
    playground: true
  }
})
```

`true` 使用 InPress 默认键名。同一来源下有多个站点或 Playground 时，可以指定独立键名：

```ts
themeConfig: {
  playground: {
    storageKey: 'my-site-theme'
  }
}
```

省略或设为 `false` 时，修改仍会在当前 SPA 会话内生效，但刷新后丢失。类型定义见 [`ThemePlaygroundConfig`](/zh/api/theme-playground-config)。

