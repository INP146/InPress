# FaviconConfig

- Import: `@inp146/inpress`
- Kind: TypeScript type

Describes the [`favicon`](/config/favicon) setting.

```ts
import type { DefaultTheme } from 'vitepress/theme'

type FaviconConfig = boolean | DefaultTheme.ThemeableImage
```

`true` uses the navigation logo, `false` disables InPress favicon management, and a `ThemeableImage` supplies a separate string or light/dark image source.

