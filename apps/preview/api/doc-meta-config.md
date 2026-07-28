# DocMetaConfig

- Import: `@inp146/inpress`
- Kind: TypeScript interface

Controls the document metadata row.

```ts
interface DocMetaConfig {
  author?: string
  homeLabel?: string
  readingSpeed?: number
  timeZone?: string
}
```

| Field | Default | Description |
| --- | --- | --- |
| `author` | `undefined` | Fallback author used when a page does not define one |
| `homeLabel` | Localized | Accessible label and tooltip for the home breadcrumb |
| `readingSpeed` | `220` | Number of words or CJK characters read per minute |
| `timeZone` | `UTC` | IANA time zone used to format Git timestamps |

`DocMetaPageConfig` is also exported for typed page metadata integrations. It accepts `author`, `date`, `views`, `wordCount`, and `readingTime`.
