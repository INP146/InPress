# InPressThemeConfig

- Import: `@inp146/inpress`
- Kind: TypeScript interface

Describes every InPress-specific field added to VitePress `themeConfig`.

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

InPress augments VitePress's `DefaultTheme.Config`, so normal `defineConfig` usage receives these fields without a manual type assertion.

