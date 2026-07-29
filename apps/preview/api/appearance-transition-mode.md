# AppearanceTransitionMode

- Import: `@inp146/inpress`
- Kind: TypeScript type

Names the animated modes accepted by [`appearanceTransition`](/config/appearance-transition).

```ts
type AppearanceTransitionMode = 'spread' | 'spread-light' | 'fade'
```

`'spread'` animates the dark theme layer, while `'spread-light'` animates the light theme layer. The configuration also accepts booleans: `true` is an alias for `'spread'`, while `false` disables animation.
