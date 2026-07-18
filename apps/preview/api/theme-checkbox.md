# ThemeCheckbox

- Import: `@inp146/inpress`
- Kind: Vue component

A styled checkbox that follows VitePress theme tokens.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeCheckbox } from '@inp146/inpress'

const enabled = ref(true)
</script>

<template>
  <ThemeCheckbox v-model="enabled">Enable feature</ThemeCheckbox>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | required | Value controlled by `v-model`. |
| `disabled` | `boolean` | `false` | Disables interaction. |

The default slot supplies the label. Additional attributes are forwarded to the native checkbox input; `class` and `style` are applied to the root label.

