# GiscusMapping

- Import: `@inp146/inpress`
- Kind: TypeScript union

Lists the page-to-discussion mapping modes accepted by [`GiscusConfig`](/api/giscus-config).

```ts
type GiscusMapping =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'
```

Use the same mode selected at [giscus.app](https://giscus.app). `pathname` maps by the page path; `url` includes the full page URL; `specific` and `number` require an appropriate `term`.

