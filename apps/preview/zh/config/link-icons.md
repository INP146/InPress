# linkIcons

- 类型：`boolean | readonly LinkIconProvider[]`
- 默认值：`true`

为匹配的平台链接添加图标。`true` 启用全部平台，`false` 关闭功能，传入数组则只启用选中的平台。

```ts
export default defineConfig({
  themeConfig: {
    linkIcons: ['github', 'youtube', 'npm']
  }
})
```

平台名称见 [`LinkIconProvider`](/zh/api/link-icon-provider)。`x` 同时匹配 `twitter.com`，`youtube` 匹配 `youtu.be`，`bilibili` 匹配 `b23.tv`，`discord` 匹配 `discord.gg`，`telegram` 匹配 `t.me` 和 `telegram.me`。

## CSS token

| Token | 默认值 | 说明 |
| --- | --- | --- |
| `--inpress-provider-link-icon-size` | `20px` | 通用图标高度和正方形图标宽度。 |
| `--inpress-provider-link-icon-threads-width` | `17.5px` | 保持 Threads 原始比例的宽度。 |
| `--inpress-provider-link-icon-gap` | `4px` | 图标与链接文字之间的间距。 |
| `--inpress-provider-link-icon-align` | `middle` | 行内垂直对齐方式。 |
| `--inpress-provider-link-icon-offset` | `-1px` | 最终视觉垂直偏移。 |

