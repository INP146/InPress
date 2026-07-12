# Getting started

The reusable implementation lives in `packages/theme`. This VitePress site is intentionally only a preview host.

## Development

Run this command from the repository root:

```sh
pnpm install
pnpm dev
```

The preview imports `@your-scope/vitepress-theme`, but Vite aliases it to `packages/theme/src/index.ts` during development. Changes to theme source therefore update the preview without publishing or rebuilding the package.

## Theme entry

`src/index.ts` extends `vitepress/theme`, which preserves the default theme while allowing you to add CSS, global components, app setup, or a wrapped layout.

<ThemeBadge label="Registered by the theme" />
