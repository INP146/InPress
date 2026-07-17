# Configuration & API

## Theme entry

Use the default export in `.vitepress/theme/index.ts`:

```ts
import theme from '@inp146/inpress'

export default theme
```

When consuming the built package, import its styles alongside the theme entry:

```ts
import '@inp146/inpress/style.css'
```

## Theme settings

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    color: '#0f766e',
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
| `color` | `ThemeColor` | - | A `#RGB` or `#RRGGBB` seed used to generate accessible light and dark brand and button tokens. |
| `linkIcons` | `boolean \| LinkIconProvider[]` | `true` | Enables all provider icons by default. Set `false` to disable them, or pass a list to enable a subset. |
| `autoLinkText` | `boolean` | `true` | Replaces bare GitHub and GitLab URLs with `user/repo`, and bare npm package URLs with the package name. Set `false` to keep the URL text. |
| `hideLinkUnderline` | `boolean` | `true` | Hides text underlines for links inside `.vp-doc`. Set `false` to restore the VitePress default. |
| `appearanceTransition` | `boolean \| 'spread' \| 'fade'` | `true` | Selects the light and dark mode transition when the browser supports View Transition API. `true` and `'spread'` expand from the switch position, `'fade'` crossfades the themes, and `false` disables animation. |
| `playground` | `boolean \| { storageKey?: string }` | `false` | Enables local-storage persistence for `ThemeConfigPlayground`. Set `true` to use the default key, or provide `storageKey` to isolate the saved settings. |
| `analytics` | `AnalyticsConfig \| false` | - | Enables Google Analytics, Microsoft Clarity, or both. Set `false` to disable them. |
| `giscus` | `GiscusConfig \| false` | - | Enables Giscus below each document page. Set `false` to disable it. |

Generated color declarations have higher selector specificity than ordinary site CSS. Omit `color` if the site needs to define the VitePress brand and button tokens manually in its theme stylesheet. Other CSS custom properties, including geometry and typography tokens, also belong in that stylesheet.

## Theme playground

Place the optional playground form directly in any development or public demo page:

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/inpress/playground'
</script>

<ThemeConfigPlayground />
```

The component takes no props and renders inline at its position in the page. Its edits update the shared runtime theme state, so the brand color, provider-link presentation, link behavior, appearance transition, and Giscus visibility change across the entire current SPA rather than inside a separate preview. It does not edit VitePress navigation, sidebar configuration, or arbitrary CSS custom properties. Giscus can only be enabled when the site already provides a valid `giscus` configuration. Analytics is intentionally excluded because a visitor-facing control must not load tracking scripts.

Enable persistence through the site configuration:

```ts
themeConfig: {
  playground: true
}
```

`true` stores edits under InPress's default local-storage key and restores them after a reload. Use `playground: { storageKey: 'my-site-theme' }` when multiple sites or playgrounds on the same origin need separate saved settings. When `playground` is omitted or `false`, edits still apply site-wide for the current SPA session but are not restored after a reload. The generated `themeConfig` output contains the selected `color` seed and feature settings.

## Appearance transition

Set `appearanceTransition: 'spread'` to expand the new theme from the switch position, or `'fade'` to crossfade between themes. `true` remains an alias for `'spread'`. Browsers without the View Transition API, and users who prefer reduced motion, keep VitePress's instant switch. Set `appearanceTransition: false` to opt out.

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

By default, both markers use the global VitePress brand tokens, including the palette generated from `color`. Override the marker-specific colors with `--inpress-marker-color` or `--inpress-marker-highlight-color`; geometry can be adjusted with `--inpress-marker-thickness`, `--inpress-marker-offset`, and `--inpress-marker-highlight-radius`.

## Sidebar hierarchy

First-level links are indented by `16px` below their group heading. Override the spacing with `--inpress-sidebar-indent`.

## Provider link icons

`LinkIconProvider` is one of: `github`, `gitlab`, `npm`, `discord`, `telegram`, `linkedin`, `reddit`, `twitch`, `tiktok`, `weibo`, `xiaohongshu`, `zhihu`, `juejin`, `x`, `instagram`, `threads`, `youtube`, or `bilibili`.

The `x` provider also matches `twitter.com`; `youtube` matches `youtu.be`; `bilibili` matches `b23.tv`; `discord` matches `discord.gg`; and `telegram` matches `t.me` and `telegram.me`.

When an auto-link has no explicit label, GitHub and GitLab links are displayed as `user/repo`; npm links use their package name. For example, `<https://github.com/vuejs/vitepress>` displays as `vuejs/vitepress`. Explicit Markdown labels, such as `[VitePress](https://github.com/vuejs/vitepress)`, are never changed.

These CSS custom properties adjust every provider icon:

| Token | Default | Description |
| --- | --- | --- |
| `--inpress-provider-link-icon-size` | `20px` | Common icon height and square icon width. |
| `--inpress-provider-link-icon-threads-width` | `17.5px` | Threads width, preserving its original aspect ratio. |
| `--inpress-provider-link-icon-gap` | `4px` | Space between icon and link text. |
| `--inpress-provider-link-icon-align` | `middle` | Inline vertical alignment mode. |
| `--inpress-provider-link-icon-offset` | `-1px` | Final visual vertical adjustment. |

## Package exports

| Export | Import path | Description |
| --- | --- | --- |
| Default theme | `@inp146/inpress` | Theme object for `.vitepress/theme/index.ts`. |
| `linkIconProviders` | `@inp146/inpress` | Array containing every supported provider identifier. |
| `LinkIconProvider` | `@inp146/inpress` | Union type for provider identifiers. |
| `ThemeColor` | `@inp146/inpress` | Type for the hexadecimal brand-color seed. |
| `AnalyticsConfig` | `@inp146/inpress` | Google Analytics and Microsoft Clarity configuration. |
| `GiscusConfig` | `@inp146/inpress` | Giscus widget configuration. |
| `InPressThemeConfig` | `@inp146/inpress` | Type of the theme-specific fields in `themeConfig`. |
| `ThemeConfigPlayground` | `@inp146/inpress/playground` | Inline runtime editor whose changes apply across the current site session. |

## Interface language

Import `themeI18n` through the Node-safe subpath and spread the matching preset into VitePress configuration:

```ts
import { themeI18n } from '@inp146/inpress/i18n'

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
