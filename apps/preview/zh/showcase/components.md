<script setup>
import ComponentDemo from '../../.vitepress/theme/components/ComponentDemo.vue'
</script>

# 组件展示

集中展示 InPress 提供的交互控件与内容增强效果。

## Checkbox

`ThemeCheckbox` 提供一致的选中、悬停、焦点和禁用状态。文案通过默认插槽传入，原生 input 属性和事件会透传到内部 checkbox。

<ComponentDemo kind="checkbox" locale="zh" />

```vue
<script setup>
import { ref } from 'vue'
import { ThemeCheckbox } from '@inp146/inpress'

const enabled = ref(true)
</script>

<ThemeCheckbox v-model="enabled">版本更新</ThemeCheckbox>
```

## Switch

需要设置立即生效时使用 `ThemeSwitch`。组件使用标准 switch 语义，并支持禁用状态。

<ComponentDemo kind="switch" locale="zh" />

```vue
<script setup>
import { ref } from 'vue'
import { ThemeSwitch } from '@inp146/inpress'

const enabled = ref(true)
</script>

<ThemeSwitch v-model="enabled" aria-label="启用功能" />
```

## 内容增强

### 记号笔

使用语义化的 `mark` 元素展示记号笔下划线，添加 `highlight` 类可切换为填充高亮。

<ComponentDemo kind="marker" locale="zh" />

### 平台链接

已识别的平台链接会自动显示图标。GitHub、GitLab 和 npm 保留裸 URL，用于展示自动生成的仓库名与包名；其他平台使用显式链接文案。

<ComponentDemo kind="providers" locale="zh" />
