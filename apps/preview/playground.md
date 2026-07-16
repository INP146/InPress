<script setup>
import { ThemeConfigPlayground } from '@inp146/inpress/playground'
import { VPButton } from 'vitepress/theme'
</script>

# Theme playground

<ClientOnly>
  <ThemeConfigPlayground persist initially-open />
</ClientOnly>

Use the panel to adjust this theme's colors and behavior. The generated output can be placed directly inside `defineConfig()`.

## Brand elements

<div style="display: flex; gap: 12px; flex-wrap: wrap">
  <VPButton theme="brand" text="Primary action" href="https://github.com/vuejs/vitepress" />
  <VPButton theme="alt" text="Secondary action" href="https://vitepress.dev/" />
</div>

The theme's <mark>underline marker</mark> and <mark class="highlight">brush highlight</mark> follow the active brand colors.

## Provider links

- <https://github.com/vuejs/vitepress>
- <https://gitlab.com/gitlab-org/gitlab>
- <https://www.npmjs.com/package/vitepress>
- [YouTube](https://www.youtube.com/)
- [Bilibili](https://www.bilibili.com/)

## Content preview

Theme variables also affect regular [document links](https://vitepress.dev/), inline code such as `themeConfig`, and the appearance switch in the navigation bar.

```ts
export default defineConfig({
  themeConfig: {
    hideLinkUnderline: true,
    appearanceTransition: 'spread'
  }
})
```
