# 组件

此页面用于确认由主题包注册的组件可在 Markdown 内容中使用。

## Theme badge

<ThemeBadge label="由工作区主题渲染" />

该组件也会从包中导出；当消费方希望进行局部注册或组合时，可以直接导入它。

## 平台链接

平台链接图标默认开启。可通过 `themeConfig` 为站点关闭，或指定只启用部分平台：

```ts
// .vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
  themeConfig: {
    inp146: {
      linkIcons: false,
      // 或：linkIcons: ['github', 'youtube']
    },
  },
});
```

### 开发者与社区

- <https://github.com/vuejs/vitepress>
- <https://gitlab.com/gitlab-org/gitlab>
- <https://www.npmjs.com/package/vitepress>
- [Discord](https://discord.gg/)
- [Telegram](https://t.me/)
- [LinkedIn](https://www.linkedin.com/)
- [Reddit](https://www.reddit.com/)

### 社交与视频

- [X](https://x.com/)
- [Instagram](https://www.instagram.com/)
- [Threads](https://www.threads.net/)
- [Twitch](https://www.twitch.tv/)
- [TikTok](https://www.tiktok.com/)
- [YouTube](https://www.youtube.com/)
- [哔哩哔哩](https://www.bilibili.com/)

### 中文平台

- [微博](https://www.weibo.com/)
- [小红书](https://www.xiaohongshu.com/)
- [知乎](https://www.zhihu.com/)
- [掘金](https://juejin.cn/)
