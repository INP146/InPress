# ThemePlaygroundConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

配置 [`playground`](/zh/config/playground) 设置的持久化行为。

```ts
interface ThemePlaygroundConfig {
  storageKey?: string
}
```

多个 InPress 站点或 Playground 共用同一来源时，`storageKey` 可隔离保存的数据。

