# ThemePlaygroundConfig

- Import: `@inp146/inpress`
- Kind: TypeScript interface

Configures persistence for the [`playground`](/config/playground) setting.

```ts
interface ThemePlaygroundConfig {
  storageKey?: string
}
```

`storageKey` isolates saved settings when multiple InPress sites or playgrounds share the same origin.

