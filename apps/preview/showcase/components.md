# Components

This page ensures components registered from the theme package work in Markdown content.

## Theme badge

<ThemeBadge label="Rendered from the workspace theme" />

The component is also exported from the package for direct imports when a consumer needs local registration or composition.

## Provider links

Provider link icons are enabled by default. Disable them for a site, or choose a subset, through `themeConfig`:

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
  themeConfig: {
    inp146: {
      linkIcons: false,
      // Or: linkIcons: ['github', 'youtube']
    },
  },
});
```

### Developer and community

- <https://github.com/vuejs/vitepress>
- <https://gitlab.com/gitlab-org/gitlab>
- <https://www.npmjs.com/package/vitepress>
- [Discord](https://discord.gg/)
- [Telegram](https://t.me/)
- [LinkedIn](https://www.linkedin.com/)
- [Reddit](https://www.reddit.com/)

### Social and video

- [X](https://x.com/)
- [Instagram](https://www.instagram.com/)
- [Threads](https://www.threads.net/)
- [Twitch](https://www.twitch.tv/)
- [TikTok](https://www.tiktok.com/)
- [YouTube](https://www.youtube.com/)
- [Bilibili](https://www.bilibili.com/)

### Chinese platforms

- [Weibo](https://www.weibo.com/)
- [Xiaohongshu](https://www.xiaohongshu.com/)
- [Zhihu](https://www.zhihu.com/)
- [Juejin](https://juejin.cn/)
