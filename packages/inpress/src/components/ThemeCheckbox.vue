<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const model = defineModel<boolean>({ required: true })
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)
</script>

<template>
  <label
    class="inpress-checkbox"
    :class="[
      { 'is-checked': model, 'is-disabled': disabled },
      $attrs.class
    ]"
    :style="$attrs.style"
  >
    <input
      v-model="model"
      v-bind="inputAttrs"
      type="checkbox"
      :disabled="disabled"
    />
    <span class="control" aria-hidden="true" />
    <span v-if="$slots.default" class="label"><slot /></span>
  </label>
</template>

<style scoped>
.inpress-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.inpress-checkbox:hover:not(.is-disabled) .control {
  border-color: var(--vp-c-brand-1);
}

input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.control {
  position: relative;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  box-shadow: inset 0 0 0 1px transparent;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.control::after {
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid var(--vp-c-white);
  border-width: 0 2px 2px 0;
  content: '';
  opacity: 0;
  transform: rotate(45deg) scale(0.7);
  transition:
    opacity 0.15s,
    transform 0.15s;
}

input:checked + .control {
  border-color: var(--vp-button-brand-bg, var(--vp-c-brand-1));
  background: var(--vp-button-brand-bg, var(--vp-c-brand-1));
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--vp-c-black) 12%, transparent);
}

input:checked + .control::after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

input:focus-visible + .control {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.label {
  min-width: 0;
}

.inpress-checkbox.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .control,
  .control::after {
    transition: none;
  }
}
</style>
