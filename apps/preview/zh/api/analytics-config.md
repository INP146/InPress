# AnalyticsConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

描述 [`analytics`](/zh/config/analytics) 启用的服务。

```ts
interface AnalyticsConfig {
  googleAnalytics?: string
  clarity?: string
}
```

| 字段 | 说明 |
| --- | --- |
| `googleAnalytics` | GA4 衡量 ID，例如 `G-XXXXXXXXXX`。 |
| `clarity` | Microsoft Clarity 项目 ID。 |

两个字段可独立使用。

