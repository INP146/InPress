# ThemeCheckbox

- 导入路径：`@inp146/inpress`
- 类型：Vue 组件

使用 VitePress 主题 token 的 checkbox 控件。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeCheckbox } from '@inp146/inpress'

const enabled = ref(true)
</script>

<template>
  <ThemeCheckbox v-model="enabled">启用功能</ThemeCheckbox>
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | 必填 | 由 `v-model` 控制的值。 |
| `disabled` | `boolean` | `false` | 禁用交互。 |

默认插槽提供文案。其他 attribute 会透传给原生 checkbox input；`class` 和 `style` 会应用到根 label。

