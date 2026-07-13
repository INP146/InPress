# Configuration & API

## Theme entry

Use the default export in `.vitepress/theme/index.ts`:

```ts
import theme from '@inp146/vitepress-theme'

export default theme
```

`createTheme()` is also exported for programmatic composition and currently accepts no options. Site-specific settings belong in `themeConfig.inp146`.

## Theme settings

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    inp146: {
      cssVars: {
        root: {
          '--vp-c-brand-1': '#0f766e'
        },
        dark: {
          '--vp-c-brand-1': '#2dd4bf'
        }
      },
      linkIcons: ['github', 'youtube'],
      hideLinkUnderline: false
    }
  }
})
```

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `cssVars.root` | `Record<\`--${string}\`, string \| number>` | - | CSS custom properties applied to `:root`. |
| `cssVars.dark` | `Record<\`--${string}\`, string \| number>` | - | CSS custom properties applied to `:root.dark`. |
| `linkIcons` | `boolean \| LinkIconProvider[]` | `true` | Enables all provider icons by default. Set `false` to disable them, or pass a list to enable a subset. |
| `autoLinkText` | `boolean` | `true` | Replaces bare GitHub and GitLab URLs with `user/repo`, and bare npm package URLs with the package name. Set `false` to keep the URL text. |
| `hideLinkUnderline` | `boolean` | `true` | Hides text underlines for links inside `.vp-doc`. Set `false` to restore the VitePress default. |

## Provider link icons

`LinkIconProvider` is one of: `github`, `gitlab`, `npm`, `discord`, `telegram`, `linkedin`, `reddit`, `twitch`, `tiktok`, `weibo`, `xiaohongshu`, `zhihu`, `juejin`, `x`, `instagram`, `threads`, `youtube`, or `bilibili`.

The `x` provider also matches `twitter.com`; `youtube` matches `youtu.be`; `bilibili` matches `b23.tv`; `discord` matches `discord.gg`; and `telegram` matches `t.me` and `telegram.me`.

When an auto-link has no explicit label, GitHub and GitLab links are displayed as `user/repo`; npm links use their package name. For example, `<https://github.com/vuejs/vitepress>` displays as `vuejs/vitepress`. Explicit Markdown labels, such as `[VitePress](https://github.com/vuejs/vitepress)`, are never changed.

These CSS custom properties adjust every provider icon:

| Token | Default | Description |
| --- | --- | --- |
| `--theme-provider-link-icon-size` | `20px` | Common icon height and square icon width. |
| `--theme-provider-link-icon-threads-width` | `17.5px` | Threads width, preserving its original aspect ratio. |
| `--theme-provider-link-icon-gap` | `4px` | Space between icon and link text. |
| `--theme-provider-link-icon-align` | `middle` | Inline vertical alignment mode. |
| `--theme-provider-link-icon-offset` | `-1px` | Final visual vertical adjustment. |
| `--theme-provider-link-icon-github-offset` | Global offset minus `1px` | GitHub-specific vertical adjustment. |

## Package exports

| Export | Import path | Description |
| --- | --- | --- |
| Default theme | `@inp146/vitepress-theme` | Theme object for `.vitepress/theme/index.ts`. |
| `createTheme()` | `@inp146/vitepress-theme` | Creates the same theme object for programmatic use. |
| `ThemeBadge` | `@inp146/vitepress-theme` | Vue component registered globally by the theme. Its optional `label` prop defaults to `Theme component`. |
| `linkIconProviders` | `@inp146/vitepress-theme` | Array containing every supported provider identifier. |
| `LinkIconProvider` | `@inp146/vitepress-theme` | Union type for provider identifiers. |
| `resolveProviderLinkText()` | `@inp146/vitepress-theme` | Resolves compact labels for supported provider URLs. |
| `ThemeCssVars` | `@inp146/vitepress-theme` | Type for a CSS custom-property record. |
| `Inp146ThemeSettings` | `@inp146/vitepress-theme` | Type of `themeConfig.inp146`. |
| `Inp146ThemeConfig` | `@inp146/vitepress-theme` | Type containing the `inp146` namespace. |

## Interface language

Import `themeI18n` through the Node-safe subpath and spread the matching preset into VitePress configuration:

```ts
import { themeI18n } from '@inp146/vitepress-theme/i18n'

export default defineConfig({
  themeConfig: {
    ...themeI18n.en
  },
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        ...themeI18n.zh
      }
    }
  }
})
```
