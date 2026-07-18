# Default theme

- Import: `@inp146/inpress`
- Kind: default export

The default export extends the VitePress default theme and installs InPress's layout behavior and styles.

```ts
// .vitepress/theme/index.ts
import theme from '@inp146/inpress'

export default theme
```

The theme entry automatically loads core and component styles. Consumers that only need the stylesheet can import the `@inp146/inpress/style.css` subpath manually.

