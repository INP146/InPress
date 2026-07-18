# ThemeColor

- Import: `@inp146/inpress`
- Kind: TypeScript type

Represents the hexadecimal seed accepted by [`color`](/config/color).

```ts
type ThemeColor = `#${string}`
```

The runtime accepts only `#RGB` and `#RRGGBB` values. The template-literal type ensures the leading `#`; runtime validation enforces the exact length and hexadecimal characters.

