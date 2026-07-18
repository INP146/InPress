# autoLinkText

- 类型：`boolean`
- 默认值：`true`

把支持的裸 URL 缩短为更有意义的文案。GitHub、GitLab URL 会显示为 `user/repo`，npm 包 URL 会显示为包名。

```md
<https://github.com/vuejs/vitepress>
```

上例显示为 `vuejs/vitepress`。显式 Markdown 文案不会被修改：

```md
[VitePress](https://github.com/vuejs/vitepress)
```

设置 `autoLinkText: false` 可保留完整 URL 文本。

