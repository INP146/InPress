<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

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
  <button
    class="inpress-playground-switch"
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    @click="model = !model"
  >
    <span class="check" />
  </button>
</template>

<style scoped>
.inpress-playground-switch {
  position: relative;
  display: block;
  flex: 0 0 40px;
  width: 40px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--vp-input-border-color);
  border-radius: 11px;
  background-color: var(--vp-input-switch-bg-color);
  cursor: pointer;
  transition:
    border-color 0.25s,
    background-color 0.25s !important;
}

.inpress-playground-switch:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
}

.check {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--vp-c-neutral-inverse);
  box-shadow: var(--vp-shadow-1);
  transition: transform 0.25s !important;
}

.inpress-playground-switch[aria-checked='true'] .check {
  background-color: var(--vp-c-white);
  transform: translateX(18px);
}

.inpress-playground-switch[aria-checked='true'] {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-1);
}

.inpress-playground-switch:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .inpress-playground-switch,
  .check {
    transition: none !important;
  }
}
</style>
