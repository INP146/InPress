# giscus

- 类型：`GiscusConfig | false`
- 默认值：`undefined`

在每篇文档页下方添加 Giscus 评论。

```ts
export default defineConfig({
  themeConfig: {
    giscus: {
      repo: 'owner/repository',
      repoId: 'R_kgDO...',
      category: 'Announcements',
      categoryId: 'DIC_kwDO...',
      mapping: 'url',
      inputPosition: 'bottom',
      lang: 'zh-CN'
    }
  }
})
```

配置 InPress 前，请先为仓库启用 Discussions、安装 [Giscus GitHub App](https://github.com/apps/giscus)，并在 [giscus.app](https://giscus.app) 生成仓库参数。

组件默认跟随 VitePress 的浅色与深色模式。自定义主题可使用 HTTPS URL 或站点根相对 CSS 路径：

```ts
theme: {
  light: '/giscus/light.css',
  dark: '/giscus/dark.css'
}
```

Giscus 从 iframe 加载自定义 CSS，因此响应必须允许 `https://giscus.app` 跨域访问。HTTPS iframe 无法加载普通 HTTP 样式，本地开发时会回退到对应的内置主题。

在单篇文档的 frontmatter 中设置 `giscus: false` 可隐藏评论。完整字段见 [`GiscusConfig`](/zh/api/giscus-config)。

