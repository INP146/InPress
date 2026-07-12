# VitePress theme workspace

This repository treats the VitePress theme as the product and `apps/preview` as its development playground.

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

## Structure

- `packages/theme`: independently publishable VitePress 2 theme package.
- `apps/preview`: local VitePress site used to develop and validate the theme.

The preview aliases the package name to `packages/theme/src/index.ts`; package consumers resolve the built `dist` entry instead. Replace `@your-scope` with your npm scope before publishing.
