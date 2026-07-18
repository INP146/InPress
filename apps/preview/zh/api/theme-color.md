# ThemeColor

- 导入路径：`@inp146/inpress`
- 类型：TypeScript type

表示 [`color`](/zh/config/color) 接受的十六进制颜色种子。

```ts
type ThemeColor = `#${string}`
```

运行时只接受 `#RGB` 和 `#RRGGBB`。模板字面量类型保证开头的 `#`，运行时校验负责限制长度和十六进制字符。

