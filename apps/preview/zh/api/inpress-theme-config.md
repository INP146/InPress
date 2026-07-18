# InPressThemeConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

描述 InPress 添加到 VitePress `themeConfig` 的全部字段。

```ts
interface InPressThemeConfig {
  color?: ThemeColor
  playground?: boolean | ThemePlaygroundConfig
  favicon?: FaviconConfig
  logoMonochrome?: boolean
  homeLogoMonochrome?: boolean
  linkIcons?: boolean | readonly LinkIconProvider[]
  autoLinkText?: boolean
  hideLinkUnderline?: boolean
  appearanceTransition?: boolean | AppearanceTransitionMode
  analytics?: AnalyticsConfig | false
  giscus?: GiscusConfig | false
}
```

InPress 会扩展 VitePress 的 `DefaultTheme.Config`，正常使用 `defineConfig` 时即可获得这些字段，无需手动类型断言。

