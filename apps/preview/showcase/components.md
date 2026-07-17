<script setup>
import ComponentDemo from '../.vitepress/theme/components/ComponentDemo.vue'
</script>

# Components

Interactive examples of the controls and content enhancements provided by InPress.

## Checkbox

`ThemeCheckbox` provides a consistent checked, hover, focus, and disabled state. Labels are passed through the default slot, while native input attributes and events are forwarded to the underlying checkbox.

<ComponentDemo kind="checkbox" locale="en" />

```vue
<script setup>
import { ref } from 'vue'
import { ThemeCheckbox } from '@inp146/inpress'

const enabled = ref(true)
</script>

<ThemeCheckbox v-model="enabled">Release notes</ThemeCheckbox>
```

## Switch

Use `ThemeSwitch` for settings that take effect immediately. It exposes button-based switch semantics and supports disabled states.

<ComponentDemo kind="switch" locale="en" />

```vue
<script setup>
import { ref } from 'vue'
import { ThemeSwitch } from '@inp146/inpress'

const enabled = ref(true)
</script>

<ThemeSwitch v-model="enabled" aria-label="Enable feature" />
```

## Content enhancements

### Marker

Use semantic `mark` elements for marker-style emphasis. Add the `highlight` class for a filled treatment.

<ComponentDemo kind="marker" locale="en" />

### Provider links

Recognized provider links receive an icon automatically. The GitHub, GitLab, and npm examples use bare URLs to demonstrate automatic repository and package labels; the other providers use explicit link text.

<ComponentDemo kind="providers" locale="en" />
