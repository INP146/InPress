# DocMetaConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

控制文档信息栏。

```ts
interface DocMetaConfig {
  author?: string
  homeLabel?: string
  readingSpeed?: number
  timeZone?: string
}
```

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `author` | `undefined` | 页面未声明作者时使用的默认作者 |
| `homeLabel` | 根据语言生成 | 首页面包屑的无障碍标签和提示文字 |
| `readingSpeed` | `220` | 每分钟阅读的单词或中日韩字符数 |
| `timeZone` | `UTC` | 格式化 Git 时间时使用的 IANA 时区 |

包还会导出 `DocMetaPageConfig`，用于带类型的页面信息集成。该接口包含 `author`、`date`、`views`、`wordCount` 和 `readingTime`。
