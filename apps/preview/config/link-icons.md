# linkIcons

- Type: `boolean | readonly LinkIconProvider[]`
- Default: `true`

Adds provider icons to matching links. `true` enables every supported provider, `false` disables the feature, and an array enables only the selected providers.

```ts
export default defineConfig({
  themeConfig: {
    linkIcons: ['github', 'youtube', 'npm']
  }
})
```

Provider names are documented by [`LinkIconProvider`](/api/link-icon-provider). `x` also matches `twitter.com`; `youtube` matches `youtu.be`; `bilibili` matches `b23.tv`; `discord` matches `discord.gg`; and `telegram` matches `t.me` and `telegram.me`.

## CSS tokens

| Token | Default | Description |
| --- | --- | --- |
| `--inpress-provider-link-icon-size` | `20px` | Common icon height and square icon width. |
| `--inpress-provider-link-icon-threads-width` | `17.5px` | Threads width, preserving its aspect ratio. |
| `--inpress-provider-link-icon-gap` | `4px` | Space between icon and link text. |
| `--inpress-provider-link-icon-align` | `middle` | Inline vertical alignment. |
| `--inpress-provider-link-icon-offset` | `-1px` | Final visual vertical adjustment. |

