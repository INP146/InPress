# appearanceTransition

- Type: `boolean | AppearanceTransitionMode`
- Default: `true`

Controls the light and dark mode transition.

```ts
export default defineConfig({
  themeConfig: {
    appearanceTransition: 'spread-light'
  }
})
```

| Value | Behavior |
| --- | --- |
| `true` or `'spread'` | Expands the dark theme from the appearance switch and contracts it when returning to light. |
| `'spread-light'` | Expands the light theme from the appearance switch and contracts it when returning to dark. |
| `'fade'` | Crossfades between themes. |
| `false` | Disables the transition. |

Browsers without the View Transition API and users who prefer reduced motion keep VitePress's instant switch. See [`AppearanceTransitionMode`](/api/appearance-transition-mode) for the named modes.
