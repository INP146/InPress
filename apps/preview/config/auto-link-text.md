# autoLinkText

- Type: `boolean`
- Default: `true`

Shortens supported bare URLs into useful labels. GitHub and GitLab URLs become `user/repo`; npm package URLs become the package name.

```md
<https://github.com/vuejs/vitepress>
```

The example displays as `vuejs/vitepress`. Explicit Markdown labels are never changed:

```md
[VitePress](https://github.com/vuejs/vitepress)
```

Set `autoLinkText: false` to preserve the full URL text.

