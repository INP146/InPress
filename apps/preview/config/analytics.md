# analytics

- Type: `AnalyticsConfig | false`
- Default: `undefined`

Loads Google Analytics, Microsoft Clarity, or both.

```ts
export default defineConfig({
  themeConfig: {
    analytics: {
      googleAnalytics: 'G-XXXXXXXXXX',
      clarity: 'xxxxxxxxxx'
    }
  }
})
```

Google Analytics records the initial visit and subsequent VitePress client-side navigation. Clarity initializes once and keeps the same session across client-side navigation. No analytics scripts are loaded when the setting is omitted or `false`.

See [`AnalyticsConfig`](/api/analytics-config) for the field definitions.

