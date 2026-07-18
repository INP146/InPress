# AnalyticsConfig

- Import: `@inp146/inpress`
- Kind: TypeScript interface

Describes the services enabled by [`analytics`](/config/analytics).

```ts
interface AnalyticsConfig {
  googleAnalytics?: string
  clarity?: string
}
```

| Field | Description |
| --- | --- |
| `googleAnalytics` | GA4 Measurement ID, such as `G-XXXXXXXXXX`. |
| `clarity` | Microsoft Clarity Project ID. |

Either field can be used independently.

