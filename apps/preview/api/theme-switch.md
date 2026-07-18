# ThemeSwitch

- Import: `@inp146/inpress`
- Kind: Vue component

A compact boolean switch that follows VitePress theme tokens.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitch } from '@inp146/inpress'

const enabled = ref(true)
</script>

<template>
  <ThemeSwitch v-model="enabled" aria-label="Enable feature" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | required | Value controlled by `v-model`. |
| `disabled` | `boolean` | `false` | Disables interaction. |

The component renders a button with `role="switch"`. Provide an accessible label with `aria-label` or an external label association.

