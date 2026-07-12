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

- [YouTube](https://www.youtube.com/)
- [哔哩哔哩](https://www.bilibili.com/)
- [GitHub](https://github.com/)
- [Twitter](https://x.com/)
- [Instagram](https://www.instagram.com/)
- [Threads](https://www.threads.net/)
