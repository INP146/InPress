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

组件默认跟随 VitePress 的浅色与深色模式。将主题设为 `'inpress'`，还可同步站点的实际计算颜色：

```ts
theme: 'inpress'
```

InPress 会从页面读取当前 VitePress 的背景、文字、边框、控件、状态色和品牌色 token，并在运行时生成 Giscus data theme。页面外观或生成的品牌色板变化时会同步更新 iframe，消费站点无需重复填写颜色值。

自定义主题仍可使用 HTTPS URL 或站点根相对 CSS 路径。Giscus 从 iframe 加载这些样式，因此响应必须允许 `https://giscus.app` 跨域访问。HTTPS iframe 无法加载普通 HTTP 样式，本地开发时会回退到对应的内置主题。

在单篇文档的 frontmatter 中设置 `giscus: false` 可隐藏评论。完整字段见 [`GiscusConfig`](/zh/api/giscus-config)。
