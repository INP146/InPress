# style.css

- Import: `@inp146/inpress/style.css`
- Kind: CSS subpath

Loads InPress's compiled core and component styles without installing the default theme export.

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import '@inp146/inpress/style.css'

export default DefaultTheme
```

Normal consumers of the [default theme](/api/default-theme) do not need this import because its styles load automatically. Use the CSS subpath only when composing a custom theme entry that needs InPress styles but not its layout behavior.

