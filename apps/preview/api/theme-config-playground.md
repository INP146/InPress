# ThemeConfigPlayground

- Import: `@inp146/inpress/playground`
- Kind: Vue component

Renders an inline editor for the current site's InPress settings.

```vue
<script setup>
import { ThemeConfigPlayground } from '@inp146/inpress/playground'
</script>

<template>
  <ThemeConfigPlayground />
</template>
```

The component takes no props. Its edits update shared runtime theme state, so brand color, provider links, link behavior, appearance transitions, and Giscus visibility change across the current SPA.

It does not edit VitePress navigation, sidebar data, arbitrary CSS custom properties, or analytics settings. Giscus can only be enabled when the site already has a valid [`giscus`](/config/giscus) configuration.

Persistence is controlled by the [`playground`](/config/playground) theme setting. Without persistence, edits last until the page is reloaded.

