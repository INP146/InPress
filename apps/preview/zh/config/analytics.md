# analytics

- 类型：`AnalyticsConfig | false`
- 默认值：`undefined`

加载 Google Analytics、Microsoft Clarity，或同时加载两者。

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

Google Analytics 会记录首次访问和后续 VitePress 客户端路由跳转。Clarity 只初始化一次，并在客户端路由跳转时保持同一会话。省略配置或设为 `false` 时不会加载分析脚本。

字段定义见 [`AnalyticsConfig`](/zh/api/analytics-config)。

