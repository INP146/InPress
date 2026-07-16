# Configuration & API

## Theme entry

Use the default export in `.vitepress/theme/index.ts`:

```ts
import theme from '@inp146/vitepress-theme'

export default theme
```

When consuming the built package, import its styles alongside the theme entry:

```ts
import '@inp146/vitepress-theme/style.css'
```

`createTheme()` is also exported for programmatic composition and currently accepts no options. Site-specific settings belong directly in `themeConfig`.

## Theme settings

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    cssVars: {
      root: {
        '--vp-c-brand-1': '#0f766e'
      },
      dark: {
        '--vp-c-brand-1': '#2dd4bf'
      }
    },
    linkIcons: ['github', 'youtube'],
    hideLinkUnderline: false,
    appearanceTransition: false,
    analytics: {
      googleAnalytics: 'G-XXXXXXXXXX',
      clarity: 'xxxxxxxxxx'
    },
    giscus: {
      repo: 'owner/repository',
      repoId: 'R_kgDO...',
      category: 'Announcements',
      categoryId: 'DIC_kwDO...'
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
| `appearanceTransition` | `boolean` | `true` | Animates light and dark mode changes from the switch position when the browser supports View Transition API. Set `false` to disable it. |
| `analytics` | `AnalyticsConfig \| false` | - | Enables Google Analytics, Microsoft Clarity, or both. Set `false` to disable them. |
| `giscus` | `GiscusConfig \| false` | - | Enables Giscus below each document page. Set `false` to disable it. |

## Theme playground

Import the optional playground component on a development or public demo page:

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/vitepress-theme/playground'
</script>

<ClientOnly>
  <ThemeConfigPlayground persist />
</ClientOnly>
```

The playground edits this theme's colors, marker tokens, provider-link presentation, link behavior, appearance transition, and Giscus visibility. It does not edit VitePress navigation or sidebar configuration. Giscus can only be enabled when the site already provides a valid `giscus` configuration. Analytics is intentionally excluded because a visitor-facing control must not load tracking scripts.

Set `initially-open` to open the panel on first render. `persist` stores the current values in local storage; use `storage-key` when a site needs a custom key. The generated `themeConfig` output includes arbitrary custom CSS variables added through the advanced editor.

## Appearance transition

When the user switches appearance, the new theme expands from the switch position. Browsers without the View Transition API, and users who prefer reduced motion, keep VitePress's instant switch. Set `appearanceTransition: false` to opt out.

## Analytics

Add a GA4 Measurement ID, a Microsoft Clarity Project ID, or both:

```ts
analytics: {
  googleAnalytics: 'G-XXXXXXXXXX',
  clarity: 'xxxxxxxxxx'
}
```

Google Analytics records the initial page and subsequent client-side VitePress navigation. Clarity is initialized once and follows the session across client-side navigation. No analytics scripts are loaded when `analytics` is omitted or set to `false`.

## Giscus comments

Giscus stores comments as GitHub Discussions. Users must configure their own repository at [giscus.app](https://giscus.app) before adding `giscus` to `themeConfig`:

1. Enable Discussions for the repository and install the [Giscus GitHub App](https://github.com/apps/giscus).
2. Open [giscus.app](https://giscus.app), enter the repository, choose a discussion category, and select the page mapping and language.
3. Copy the generated `repo`, `repoId`, `category`, and `categoryId` values into `themeConfig`.

```ts
giscus: {
  repo: 'owner/repository',
  repoId: 'R_kgDO...',
  category: 'Announcements',
  categoryId: 'DIC_kwDO...',
  mapping: 'url',
  inputPosition: 'bottom',
  lang: 'en'
}
```

Comments render after the document footer. Use the mapping selected at giscus.app; `pathname` creates a separate discussion for each page, while `url` includes the full page URL. The widget follows the VitePress light or dark appearance by default. `preferred_color_scheme` follows the operating system setting, so use a two-theme object when it must track VitePress's appearance switch. To use a custom Giscus theme, provide `theme: 'https://example.com/giscus-theme.css'`, or specify a theme for each appearance:

```ts
theme: {
  light: 'light',
  dark: 'dark_dimmed'
}
```

Set `giscus: false` in a page's frontmatter to hide comments on that page.

## Text markers

Use the underline marker for a short emphasis and the brush marker for highlighted text:

<p><mark>Underline marker</mark></p>
<p><mark class="highlight">Brush-style marker highlight</mark></p>

```html
<mark>Underline marker</mark>
<mark class="highlight">Brush-style marker highlight</mark>
```

By default, both markers derive their colors from the global VitePress brand colors. Override them with `--theme-marker-color` or `--theme-marker-highlight-color`; geometry can be adjusted with `--theme-marker-thickness`, `--theme-marker-offset`, and `--theme-marker-highlight-radius`.

## Sidebar hierarchy

First-level links are indented by `16px` below their group heading. Override the spacing with `--theme-sidebar-indent`.

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

## Package exports

| Export | Import path | Description |
| --- | --- | --- |
| Default theme | `@inp146/vitepress-theme` | Theme object for `.vitepress/theme/index.ts`. |
| `createTheme()` | `@inp146/vitepress-theme` | Creates the same theme object for programmatic use. |
| `linkIconProviders` | `@inp146/vitepress-theme` | Array containing every supported provider identifier. |
| `LinkIconProvider` | `@inp146/vitepress-theme` | Union type for provider identifiers. |
| `ThemeCssVars` | `@inp146/vitepress-theme` | Type for a CSS custom-property record. |
| `AnalyticsConfig` | `@inp146/vitepress-theme` | Google Analytics and Microsoft Clarity configuration. |
| `GiscusConfig` | `@inp146/vitepress-theme` | Giscus widget configuration. |
| `Inp146ThemeConfig` | `@inp146/vitepress-theme` | Type of the theme-specific fields in `themeConfig`. |
| `ThemeConfigPlayground` | `@inp146/vitepress-theme/playground` | Runtime editor for this theme's settings and CSS variables. |

## Interface language

Import `themeI18n` through the Node-safe subpath and spread the matching preset into VitePress configuration:

```ts
import { themeI18n } from '@inp146/vitepress-theme/i18n'

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        ...themeI18n.en
      }
    },
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
