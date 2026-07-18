# ThemeSwitch

- 导入路径：`@inp146/inpress`
- 类型：Vue 组件

使用 VitePress 主题 token 的紧凑布尔开关。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitch } from '@inp146/inpress'

const enabled = ref(true)
</script>

<template>
  <ThemeSwitch v-model="enabled" aria-label="启用功能" />
</template>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | 必填 | 由 `v-model` 控制的值。 |
| `disabled` | `boolean` | `false` | 禁用交互。 |

组件渲染带有 `role="switch"` 的 button。请通过 `aria-label` 或外部标签提供无障碍名称。

